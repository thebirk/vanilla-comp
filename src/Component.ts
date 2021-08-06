/**
 * 
 * @description
 * ```
 *   class TestComponent extends Component(`
 *   <h1 id="text"></h1>
 *   `) {
 *     @TestComponent.Attribute
 *     text: string = "default";
 *   
 *     @TestComponent.Element('#text')
 *     textElement!: HTMLHeadingElement;
 *   
 *     constructor() {
 *       super();
 *     }
 *   
 *     update() {
 *       console.log(this.text);
 *       this.textElement.innerText = this.text;
 *     }
 *   }
 *   customElements.define('test-component', TestComponent);
 * ```
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

            for (const element of Component._elementsToInit) {
                Object.defineProperty(this, element.name, {
                    value: this.shadowRoot!.querySelector(element.selector)
                });
            }

            for (const attr of Component._observedAttributes) {
                Object.defineProperty(this, '__$v_' + attr, {
                    value: (this as any)[attr],
                    configurable: true,
                    writable: true,
                });
                Object.defineProperty(this, attr, {
                    get: () => {
                        return Reflect.get(this, '__$v_' + attr);
                    },
                    set: (value) => {
                        // TODO: Throw sensible erros if the value is not a string
                        this.setAttribute(attr, value);
                    }
                });
            }
        }

        /**
         * Called once after initialization
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


        static _elementsToInit: {name: string, selector: any}[] = [];
        /**
         * Use to register an element to be fetched on construction
         * 
         * Example:
         * 
         * ```typescript
         *   @TestComponent.Element('#text')
         *   textElement!: HTMLHeadingElement;
         * ```
         * @param selector Argument passed to querySelector to find element
         * @returns 
         */
        static Element(selector: any): (target: any, propertyKey: string) => void {
            return (target, propertyKey) => {
                Component._elementsToInit.push({
                    name: propertyKey,
                    selector: selector
                });
            };
        }

        /**
         * Bind a property to an attribute
         * @param target 
         * @param propertyKey 
         */
        static Attribute(target: any, propertyKey: string) {
            // TODO: Throw sensible errors if the property is not a key. Any typescript info for this?
            Component._observedAttributes.push(propertyKey);

            // define $v_{propertyKey}
            // add propertyKey as proxy
        }
        
        static _observedAttributes: string[] = [];
        static get observedAttributes() {
            return this._observedAttributes;
        }
        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            //console.log(arguments);
            //(this.shadowRoot!.querySelector('#text') as HTMLHeadingElement).innerText = this.getAttribute('text')!;
      
            let attrChanged = false;
            for (const attr of Component._observedAttributes) {
                if (attr === name) {
                    Object.defineProperty(this, '__$v_' + attr, {
                        value: newValue,
                        configurable: true,
                    });
                    attrChanged = true;
                    break;
                }
            }
      
            if (attrChanged) {
                this.update();
            }
        }

        connectedCallback() {
            // We could set attributes to their default values if they are not set. Not sure this is what we want.
            // for (const attr of Component._observedAttributes) {
            //     if (!this.getAttribute(attr)) {
            //         this.setAttribute(attr, (this as any)[attr]);
            //     }
            // }
            this.update();
        }

        static new<T extends Component>(this: new() => T) {
            console.log("new<T extends Component>");
            const result = new this();
            result.init();
            return result;
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