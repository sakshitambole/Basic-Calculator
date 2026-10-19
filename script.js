const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let resultShown = false;

function updateDisplay() {
    display.value = expression || "0";
}

function calculate() {
    if (!expression || !/^[0-9+\-*/.() ]+$/.test(expression)) {
        return;
    }

    try {
        // Evaluate only the calculator's validated arithmetic expression.
        const result = Function('"use strict"; return (' + expression + ')')();

        if (typeof result !== "number" || !Number.isFinite(result)) {
            display.value = "Error";
            expression = "";
            resultShown = true;
            return;
        }

        expression = String(
            Number.parseFloat(result.toPrecision(12))
        );

        updateDisplay();
        resultShown = true;

    } catch {
        display.value = "Error";
        expression = "";
        resultShown = true;
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
        expression = "";
        resultShown = false;
        updateDisplay();
        return;
    }

    if (action === "delete") {
        if (resultShown) {
            expression = "";
            resultShown = false;
        } else {
            expression = expression.slice(0, -1);
        }

        updateDisplay();
        return;
    }

    if (action === "calculate") {
        calculate();
        return;
    }

    if (value !== undefined) {
        if (resultShown) {
            if ("+-*/".includes(value)) {
                resultShown = false;
            } else {
                expression = "";
                resultShown = false;
            }
        }

        if (value === ".") {
            const currentNumber = expression.split(/[+\-*/()]/).pop();

            if (currentNumber.includes(".")) return;

            if (!currentNumber) {
                expression += "0";
            }
        }

        expression += value;
        updateDisplay();
    }
});