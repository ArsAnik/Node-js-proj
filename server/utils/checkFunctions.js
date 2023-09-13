class CheckFunctions {
    checkInt (value) {
        return /^\d+$/.test(value);
    }

    checkPhoneNumber (value) {
        return /^7\d{10}$/.test(value)
    }
}

module.exports = new CheckFunctions()