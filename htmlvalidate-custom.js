import { Rule } from "html-validate";

class NoEmptyAltWithoutRole extends Rule {
    setup() {
        this.on("element:ready", (event) => {
            const node = event.target;

            if (node.tagName !== "img") return;

            const alt = node.getAttribute("alt");
            const role = node.getAttribute("role");

            if (alt === "" && role !== "presentation") {
                this.report({
                    node,
                    message:
                        'Empty alt requires role="presentation" for decorative images.',
                });
            }
        });
    }
}

export default {
    rules: {
        "no-empty-alt-without-role": NoEmptyAltWithoutRole,
    },
};
