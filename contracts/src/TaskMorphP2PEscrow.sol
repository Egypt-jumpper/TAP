// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to,uint256 value) external returns (bool);
    function transferFrom(address from,address to,uint256 value) external returns (bool);
}

contract TaskMorphP2PEscrow {
    struct Escrow {
        address seller;
        address buyer;
        uint256 amount;
        uint256 createdAt;
        bool funded;
        bool paymentMarked;
        bool disputed;
        bool settled;
    }

    IERC20 public immutable sdaToken;
    address public immutable treasury;
    address public owner;
    uint16 public immutable feeBps;
    uint16 public constant MAX_FEE_BPS = 1000;

    mapping(bytes32 => Escrow) public escrows;

    uint256 private locked;
    modifier nonReentrant() {
        require(locked == 0, "REENTRANCY");
        locked = 1;
        _;
        locked = 0;
    }
    modifier onlyOwner() { require(msg.sender == owner, "NOT_OWNER"); _; }

    event EscrowCreated(bytes32 indexed orderId,address indexed seller,address indexed buyer,uint256 amount);
    event PaymentMarked(bytes32 indexed orderId);
    event Released(bytes32 indexed orderId,uint256 sellerAmount,uint256 fee);
    event Cancelled(bytes32 indexed orderId);
    event Disputed(bytes32 indexed orderId);
    event Resolved(bytes32 indexed orderId,address indexed recipient);
    event OwnershipTransferred(address indexed oldOwner,address indexed newOwner);

    constructor(address _sdaToken,address _treasury,uint16 _feeBps) {
        require(_sdaToken != address(0) && _treasury != address(0), "ZERO_ADDRESS");
        require(_feeBps <= MAX_FEE_BPS, "FEE_TOO_HIGH");
        sdaToken = IERC20(_sdaToken);
        treasury = _treasury;
        feeBps = _feeBps;
        owner = msg.sender;
    }

    function createAndFund(bytes32 orderId,address buyer,uint256 amount) external nonReentrant {
        require(orderId != bytes32(0) && buyer != address(0) && amount > 0, "INVALID");
        require(escrows[orderId].seller == address(0), "EXISTS");
        _safeTransferFrom(msg.sender,address(this),amount);
        escrows[orderId] = Escrow(msg.sender,buyer,amount,block.timestamp,true,false,false,false);
        emit EscrowCreated(orderId,msg.sender,buyer,amount);
    }

    function markPayment(bytes32 orderId) external {
        Escrow storage e = escrows[orderId];
        require(e.seller != address(0) && !e.settled, "INVALID_ESCROW");
        require(msg.sender == e.buyer || msg.sender == e.seller || msg.sender == owner, "NOT_PARTY");
        e.paymentMarked = true;
        emit PaymentMarked(orderId);
    }

    function release(bytes32 orderId) external nonReentrant {
        Escrow storage e = escrows[orderId];
        require(e.funded && !e.settled && !e.disputed && e.paymentMarked, "NOT_RELEASEABLE");
        require(msg.sender == e.seller || msg.sender == e.buyer || msg.sender == owner, "NOT_PARTY");
        e.settled = true;
        uint256 fee = (e.amount * feeBps) / 10000;
        _safeTransfer(e.buyer,e.amount - fee);
        if (fee > 0) _safeTransfer(treasury,fee);
        emit Released(orderId,e.amount-fee,fee);
    }

    function cancel(bytes32 orderId) external nonReentrant {
        Escrow storage e = escrows[orderId];
        require(e.funded && !e.settled && !e.paymentMarked && !e.disputed, "NOT_CANCELLABLE");
        require(msg.sender == e.seller || msg.sender == owner, "NOT_PARTY");
        e.settled = true;
        _safeTransfer(e.seller,e.amount);
        emit Cancelled(orderId);
    }

    function dispute(bytes32 orderId) external {
        Escrow storage e = escrows[orderId];
        require(e.funded && !e.settled, "INVALID_ESCROW");
        require(msg.sender == e.seller || msg.sender == e.buyer, "NOT_PARTY");
        e.disputed = true;
        emit Disputed(orderId);
    }

    function resolve(bytes32 orderId,address recipient) external nonReentrant onlyOwner {
        Escrow storage e = escrows[orderId];
        require(e.funded && !e.settled && e.disputed && recipient != address(0), "INVALID_RESOLUTION");
        e.settled = true;
        _safeTransfer(recipient,e.amount);
        emit Resolved(orderId,recipient);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_ADDRESS");
        emit OwnershipTransferred(owner,newOwner);
        owner = newOwner;
    }

    function _safeTransfer(address to,uint256 amount) internal {
        (bool ok,bytes memory data)=address(sdaToken).call(abi.encodeWithSelector(IERC20.transfer.selector,to,amount));
        require(ok && (data.length==0 || abi.decode(data,(bool))),"TRANSFER_FAILED");
    }

    function _safeTransferFrom(address from,address to,uint256 amount) internal {
        (bool ok,bytes memory data)=address(sdaToken).call(abi.encodeWithSelector(IERC20.transferFrom.selector,from,to,amount));
        require(ok && (data.length==0 || abi.decode(data,(bool))),"TRANSFER_FROM_FAILED");
    }
}
