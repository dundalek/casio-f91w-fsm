/**
 * Animates a string on hover.
 * 
 * @author Alexis Philip
 */
class AnimateString {
    /**
     * Global animation keyframes array (Keyframe format) for the `Element.animate` interface.
     * @var {object[]}
     */
    static animationKeyframes = [
        {
            transform: "rotate(-7deg) scale(1.02)",
            color: "tomato",
            offset: 0.5
        },
        {
            transform: "rotate(0deg) scale(1)",
            color: "unset",
            offset: 1,
        }
    ];
    /**
     * Global animation duration in milliseconds for the `Element.animate` interface.
     * @var {number}
     */
    static animationDuration = 600;
    /**
     * On animated character mouse over callback function, with `Event` object passed as only parameter. 
     * @var {function}
     */
    static onMouseover = () => {};
    /**
     * Will either contain an animation keyframes array or {@link AnimateString.animationKeyframes} value after constructor's instanciation.
     * @type {object[]} 
     */
    #animationKeyframes;
    /**
     * Will either contain an animation duration or {@link AnimateString.animationDuration} value after constructor's instanciation.
     * @type {object[]} 
     */
    #animationDuration;
    /**
     * Will either contain a mouse over callback or {@link AnimateString.onMouseover} value after constructor's instanciation.
     * @type {object[]} 
     */
    #onMouseover;

    /**
     * Each constructor call will transform and trigger animations on "mouseover" on the given elements.
     * @param {HTMLElement[]} stringEls Array of HTML elements which text content will be animated.
     * @param {object[]|null} [animationKeyframes=null] Current instance's animation keyframes array for the `Element.animate` interface. 
     * @param {number|null} [animationDuration=null] Current instance's animation duration for the `Element.animate` interface.
     * @param {function|null} [onMouseover=null] Current instance's callback function for the 'character mouse over' event.
     */
    constructor(stringEls, animationKeyframes = null, animationDuration = null, onMouseover = null) {

        if (!!animationKeyframes) {
            this.#animationKeyframes = animationKeyframes;
        } else {
            this.#animationKeyframes = AnimateString.animationKeyframes;
        }

        if (!!animationDuration) {
            this.#animationDuration = animationDuration;
        } else {
            this.#animationDuration = AnimateString.animationDuration;
        }

        if (!!onMouseover) {
            this.#onMouseover = onMouseover;
        } else {
            this.#onMouseover = AnimateString.onMouseover;
        }

        // For each string elements to animate.
        for (const stringEl of stringEls) {
            this.#transformString(stringEl);
        }
    }

    /**
     * Transforms and triggers animations on "mouseover" on the given element's text.
     * @param {HTMLElement} stringEl Element which text content will be animated.
     */
    #transformString(stringEl) {

        // Recursively changes 
        this.#updateNodeTreeRecursive(stringEl.childNodes);

        // Selects the span elements which will be animated.
        const charEls = stringEl.querySelectorAll(".animated-string-char");

        // For each characters (span elements) to animate.
        for (const charEl of charEls) {

            // TODO: test if it's better to add listener on global string and trigger animation on elements individually

            // Adds a "mouseover" listener on the character element.
            charEl.addEventListener("mouseover", (e) => {
                // Triggers an animation on the character element.
                e.currentTarget.animate(this.#animationKeyframes, this.#animationDuration);
                this.#onMouseover(e);
            });
        }
    }

    /**
     * Recursively transforms each given child nodes to elements which can be animated.
     * @param {NodeList} childNodes Child nodes of the current element.
     */
    #updateNodeTreeRecursive(childNodes) {
        // For each child nodes.
        for (let childNode of childNodes) {
            // If the current node has at least a child (it means it's not a simple string, it contains inner HTML elements...).
            if (childNode.childNodes.length) {
                this.#updateNodeTreeRecursive(childNode.childNodes);
            } // If the current node does not has any children (it means it's a simple string, which can now be modified).
            else {
                // Here, we'll do 3 things:
                // 1. Create a `span` element which will replace the `Text` element.
                // 2. In that `span` element, we'll wrap each individual words into another `span`.
                // 3. In that word `span` element, we'll wrap each individual character into another `span`.

                // 1. Since a `Text` node cannot contain children nodes (only text), we'll create
                // a `span` node which will replace the current `Text` node.
                let newNode = document.createElement("span");
                
                // For each words in the string.
                for (let wordStr of childNode.textContent.trim().split(" ")) {
                    // 3. In the word string, wraps each character in a span element.
                    wordStr = wordStr.replace(/\S/g, "<span class='animated-string-char'>$&</span>");
                    // 2. Wraps the word string in a span element.
                    newNode.innerHTML += `<span style="display: inline-flex;">${wordStr}</span> `;
                }

                // 1. Replaces the current `Text` node with the new `span` node. 
                childNode.replaceWith(newNode);
            }
        }
    }
}
