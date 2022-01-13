// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.11;

import { CXT } from '../CXT.sol';

contract MockCXT is CXT {
    uint256 timer;
    function setTime(uint256 time) public { timer = time; }
    function getTime() internal view override returns (uint256) { return timer; }
}
