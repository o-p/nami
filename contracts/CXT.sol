// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract CXT is Context, IERC20Metadata, Ownable {
    string public constant name     = "CXT";
    string public constant symbol   = "CXT";
    uint8  public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY   = 100e8 ether;
    uint256 public constant MIN_TOTAL_SUPPLY =  40e8 ether;
    uint256 public constant MAX_FEE_PER_WEEK =   5e8 ether;
    uint256 public constant FEE_RATE         =  0.05 ether;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    mapping(address => bool) public isExcludedFromFee;

    struct Record {
        uint256 timestamp;
        uint256 totalSupply;
    }

    Record public lastWeek;

    event UpdateExcludedList(address account, bool isExcluded);

    constructor() Ownable() {
        _mint(_msgSender(), INITIAL_SUPPLY);
        _updateLastWeekRecord();

        _addToExcluded(_msgSender());
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender)
        public
        view
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(
            currentAllowance >= amount,
            "CXT: transfer amount exceeds allowance"
        );
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue)
        public
        returns (bool)
    {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender] + addedValue
        );
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        returns (bool)
    {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(
            currentAllowance >= subtractedValue,
            "CXT: decreased allowance below zero"
        );
        unchecked {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `sender` to `recipient`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal updateWeeklyReport {
        require(sender != address(0), "CXT: transfer from the zero address");
        require(recipient != address(0), "CXT: transfer to the zero address");

        uint256 senderBalance = _balances[sender];
        require(
            senderBalance >= amount,
            "CXT: transfer amount exceeds balance"
        );

        unchecked {
            _balances[sender] = senderBalance - amount;
        }

        uint256 fee = transferFee(sender, recipient, amount);
        uint256 transferAmountAfterFee = amount - fee;
        _balances[recipient] += transferAmountAfterFee;

        emit Transfer(sender, recipient, transferAmountAfterFee);
        if (fee > 0) {
            _totalSupply -= fee;
            emit Transfer(sender, address(0), fee);
        }
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "CXT: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal {
        require(owner != address(0), "CXT: approve from the zero address");
        require(spender != address(0), "CXT: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function transferFee(
        address sender,
        address recipient,
        uint256 amount
    ) public view returns (uint256) {
        if (
            totalSupply() <= MIN_TOTAL_SUPPLY ||
            isExcludedFromFee[sender] ||
            isExcludedFromFee[recipient]
        ) {
            return 0;
        }

        uint256 fee = (amount * FEE_RATE) / 1e18;

        if (totalSupply() - fee < MIN_TOTAL_SUPPLY) {
            fee = totalSupply() - MIN_TOTAL_SUPPLY;
        }

        if (totalSupply() - fee < lastWeek.totalSupply - MAX_FEE_PER_WEEK) {
            fee = totalSupply() - (lastWeek.totalSupply - MAX_FEE_PER_WEEK);
        }

        return fee;
    }

    function addToExcluded(address account) public onlyOwner {
        require(!isExcludedFromFee[account], "CXT: Already in list");

        _addToExcluded(account);
    }

    function removeFromExcluded(address account) public onlyOwner {
        require(isExcludedFromFee[account], "CXT: Not in list");

        _removeFromExcluded(account);
    }

    function _addToExcluded(address account) internal {
        isExcludedFromFee[account] = true;
        emit UpdateExcludedList(account, true);
    }

    function _removeFromExcluded(address account) internal {
        delete isExcludedFromFee[account];
        emit UpdateExcludedList(account, false);
    }

    function _updateLastWeekRecord() internal {
        lastWeek.timestamp = getTime();
        lastWeek.totalSupply = totalSupply();
    }

    function getTime() internal view virtual returns (uint256) {
        return block.timestamp;
    }

    modifier updateWeeklyReport() {
        if (
            getTime() > lastWeek.timestamp &&
            getTime() - lastWeek.timestamp >= 86400 * 7
        ) {
            _updateLastWeekRecord();
        }

        _;
    }
}
