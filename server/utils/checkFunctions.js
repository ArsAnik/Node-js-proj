class CheckFunctions {
    checkInt (value) {
        return /^\d+$/.test(value);
    }
}

module.exports = new CheckFunctions()