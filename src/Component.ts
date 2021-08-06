/**
 * @CustomElement('my-test')
 * class Test extends Component(html`
 *   <h1>No attribute Sadge</h1>
 * `) {
 *   @Attribute("default")
 *   text!: string;
 * 
 *   @Element('h1')
 *   heading!: HTMLHeadingElement;
 * 
 *   constructor() {
 *     super();
 *     this.heading.addEventListener('click', () => {
 *       this.text = "CLICKED";
 *     });
 *   }
 * 
 *   update() {
 *     console.log("hyllo");
 *     this.heading.innerText = this.text;
 *   }
 * }
 * 
 * @param template 
 * @returns 
 */
export function Component(template: string) {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = template;
    
    const cls = class Component extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({mode: 'open'});
            this.shadowRoot!.appendChild(templateElement.content.cloneNode(true));

            if (this._elementsToInit) {
                for (const element of this._elementsToInit) {
                    Object.defineProperty(this, element.name, {
                        value: this.shadowRoot!.querySelector(element.selector)
                    });
                }
            }

            if (Component._observedAttributes) {
                for (const attr of Component._observedAttributes) {
                    Object.defineProperty(this, attr.propertyKey, {
                        get: () => {
                            return this.getAttribute(attr.propertyKey) ?? attr.defaultValue;
                        },
                        set: (value) => {
                            // TODO: Throw sensible erros if the value is not a string
                            this.setAttribute(attr.propertyKey, value);
                        }
                    });
                }
            }
        }

        // what a bunch of lies
        /**
         * Called once after initialization
         * @deprecated
         */
        public init() {}
        
        /**
         * Called whenever an attribute is changed
         */
        public update() { }

        /**
         * Convention wrapper around querySelector with generic argument.
         * 
         * @param selector Passed directly to {@link document.querySelector}
         * @returns See {@link document.querySelector}
         */
        $<T extends HTMLElement>(selector: any) {
            return this.shadowRoot!.querySelector(selector) as T;
        }

        // MAGIC GUNK
        _elementsToInit!: {name: string, selector: any}[];
        static _observedAttributes: {propertyKey: string, defaultValue: string}[] = [];
        static get observedAttributes() {
            return this._observedAttributes.map(x => x.propertyKey);
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            //console.log(arguments);
            this.update();
        }
    };

    return cls;
}

export const html = (template: TemplateStringsArray) => template.join('');
export const template = (template: TemplateStringsArray) => template.join('');

export function CustomElement(elementName: string) {
    return function(constructor: CustomElementConstructor) {
        customElements.define(elementName, constructor);
    };
}

/**
 * Bind a property to an attribute. Should only be applied to properties with type `string`
 * @param target 
 * @param propertyKey 
 */
export function Attribute(defaultValue: string | undefined = undefined): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        // TODO: Throw sensible errors if the property is not a key. Any typescript info for this?
        if (!target.constructor._observedAttributes) {
            Reflect.set(target.constructor, '_observedAttributes', []);
        }
        target.constructor._observedAttributes.push({
            propertyKey,
            defaultValue
        });
    };
}

/**
 * Use to register an element to be fetched on construction
 * 
 * Example:
 * 
 * ```typescript
 *   @Element('#text')
 *   textElement!: HTMLHeadingElement;
 * ```
 * @param selector Argument passed to querySelector to find element
 * @returns 
 */
export function Element(selector: any): (target: any, propertyKey: string) => void {
    return (target, propertyKey) => {
        if (!target._elementsToInit) {
            Reflect.set(target, '_elementsToInit', []);
        }
        target._elementsToInit.push({
            name: propertyKey,
            selector: selector
        });
    };
}
