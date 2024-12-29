let string = ''; // Holds the current expression
let buttons = document.querySelectorAll('.button');

// Define patterns for functions
const patternMap = {
    sin: /^sin\s*(\d+|\(.+\))$/,
    cos: /^cos\s*(\d+|\(.+\))$/,
    tan: /^tan\s*(\d+|\(.+\))$/,
    log: /^log\s*(\d+|\(.+\))$/,
    ln: /^ln\s*(\d+|\(.+\))$/,
    // sqrt: /^Math\.sqrt\(\s*(\d+|\(.+\))\s*\)$/, // Matches Math.sqrt(x) or Math.sqrt(expression)
    exp: /^e\^\s*(\d+|\(.+\))$/, // Matches e^x or e^(expression)
    sqrt: /^√\s*(\d+|\(.+\))$/, // Pattern to match √

    power: /^\s*(.+?)\^\s*(.+?)$/ // Matches x^y (x and y can be complex)
};

Array.from(buttons).forEach((val) => {
    val.addEventListener('click', (e) => {
        const input = document.querySelector('.input');
        const buttonContent = e.target.innerHTML;

        // Replace HTML-specific characters like <sup> with the appropriate symbols
        let buttonValue = buttonContent;
        if (buttonContent.includes("<sup>")) {
            // Convert the exponential notation (e.g., e<sup>x</sup>) to e^x
            buttonValue = buttonContent.replace(/<sup>/g, '^').replace(/<\/sup>/g, '');
        }

        switch (buttonValue) {
            case 'c':
                // Clear the input
                string = '';
                input.value = string;
                break;
            case '+/-':
                // Negate the current value
                string = eval(string) * -1;
                input.value = string;
                break;
            case 'π':
                // Append Math.PI to the expression
                string += Math.PI;
                input.value = string;
                break;
            // case '√':
            //     // Append 'Math.sqrt(' to the expression
            //     // string += Math.sqrt;
            //     string += "√";
            //     input.value = string;
            //     break;
            case '=':
                // Evaluate the expression or special functions
                try {
                    // Close any unclosed parentheses for sqrt
                    let openSqrtCount = (string.match(/Math.sqrt\(/g) || []).length;
                    let closeParenCount = (string.match(/\)/g) || []).length;
                    while (openSqrtCount > closeParenCount) {
                        string += ")";
                        closeParenCount++;
                    }

                    // Handle exponential and power functions
                    if (string.includes("e^")) {
                        // Handle e^x (convert to Math.exp(x))
                        string = string.replace(/e\^/g, 'Math.exp(') + ')';
                    }

                    if (string.includes("^")) {
                        // Handle x^y (convert to Math.pow(x, y))
                        string = string.replace(/\^/g, ',');
                        string = 'Math.pow(' + string + ')';
                    }

                    for (let func in patternMap) {
                        const regex = patternMap[func];
                        if (regex.test(string)) {
                            const match = string.match(regex);
                            let result;

                            if (match) {
                                switch (func) {
                                    case 'sin':
                                        result = Math.sin(eval(match[1]) * (Math.PI / 180));
                                        break;
                                    case 'cos':
                                        result = Math.cos(eval(match[1]) * (Math.PI / 180));
                                        break;
                                    case 'tan':
                                        result = Math.tan(eval(match[1]) * (Math.PI / 180));
                                        break;
                                    case 'log':
                                        const logValue = eval(match[1]);
                                        if (logValue <= 0) throw "Invalid Input";
                                        result = Math.log10(logValue);
                                        break;
                                    case 'ln':
                                        const lnValue = eval(match[1]);
                                        if (lnValue <= 0) throw "Invalid Input";
                                        result = Math.log(lnValue);
                                        break;
                                    case 'sqrt':
                                        const sqrtValue = eval(match[1]);
                                        if (sqrtValue < 0) throw "Invalid Input";
                                        result = Math.sqrt(sqrtValue);
                                        break;
                                    case 'exp': // Handle e^x
                                        result = Math.exp(eval(match[1]));
                                        break;
                                    case 'power': // Handle x^y
                                        const base = eval(match[1]);
                                        const exponent = eval(match[2]);
                                        result = Math.pow(base, exponent);
                                        break;
                                    default:
                                        throw "Unsupported Function";
                                }
                                string = result.toString();
                                input.value = string;
                                return; // Exit after processing the matched function
                            }
                        }
                    }

                    // If no functions match, evaluate the general expression
                    string = eval(string).toString();
                    input.value = string;
                } catch (err) {
                    string = "Error!";
                    input.value = string;
                }
                break;
            case 'exp': // Handle e^x
                string += "e^"; // Append 'e^' for the exponential function
                input.value = string;
                break;
            case 'pow': // Handle x^y
                string += "^"; // Append '^' for the power function
                input.value = string;
                break;
            case '%': // Handle modulus
                string += "%"; // Append '%' for the modulus operation
                input.value = string;
                break;
            default:
                // Append clicked button's content to the expression
                string += buttonValue;
                input.value = string;
                break;
        }
    });
});