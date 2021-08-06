import './style.css'
import { Component, CustomElement, html } from  './Component';

//const app = document.querySelector<HTMLDivElement>('#app')!
//app.innerHTML = `
//  <h1>Hello Vite!</h1>
//  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
//`

//TODO: Add setters to attribute. Somehow set this without calling the setter? Hidden variable with get/set?

@CustomElement('hello-world')
class HelloWorldComponent extends Component(html`
  <span></span>
`) {
  @HelloWorldComponent.Attribute
  name: string = "asdf";
  @HelloWorldComponent.Element('span')
  textRef!: HTMLSpanElement;

  init() {
    console.log("init: this.name = " + this.name);
  }

  update() {
    console.log(`name: ${this.name}`);
    this.textRef.innerText = `Hello, ${this.name}`;
  }
}


@CustomElement('test-component')
class TestComponent extends Component(html`
  <h1 id="text"></h1>
  <p>
    Welcome <span id="name"></span>
  </p>
  <hello-world />
`) {
  @TestComponent.Attribute
  text: string = "default";
  @TestComponent.Attribute
  name: string = "";

  @TestComponent.Element('#text')
  textElement!: HTMLHeadingElement;
  @TestComponent.Element('#name')
  nameElement!: HTMLSpanElement;
  @TestComponent.Element('hello-world')
  helloElement!: HelloWorldComponent;

  constructor() {
    super();
    this.nameElement.addEventListener('click', () => {
      const result = prompt("What? What else would you like to to call you?");
      if (result) {
        this.name = result;
      }
    });
  }

  update() {
    console.log(this.text);
    this.textElement.innerText = this.text;
    this.nameElement.innerText = this.name;

    this.helloElement.name = this.name;
  }
}
