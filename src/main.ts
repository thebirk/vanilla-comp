import './style.css'
import { Component, CustomElement, Element, Attribute, html } from  './Component';

//const app = document.querySelector<HTMLDivElement>('#app')!
//app.innerHTML = `
//  <h1>Hello Vite!</h1>
//  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
//`

@CustomElement('my-test')
class Test extends Component(html`
  <h1>No attribute Sadge</h1>
`) {
  @Attribute("default")
  text!: string;

  @Element('h1')
  heading!: HTMLHeadingElement;

  constructor() {
    super();
    this.heading.addEventListener('click', () => {
      this.text = "CLICKED";
    });
  }

  update() {
    console.log("hyllo");
    this.heading.innerText = this.text;
  }
}

/*
@CustomElement('my-element')
class MyElement extends Component(html`
  <h1>Hello world!</h1>
`) {
  @Attribute
  text!: string;
  
  @Element('h1')
  heading!: HTMLHeadingElement;

  constructor() {
    super();
    console.log("element");
    console.log("cosntructor: text = " + this.text);
  }

  init() {
    console.log("init: text = " + this.text);

    this.heading.addEventListener('click', () => {
     this.text = "YEP";
   });
  }

  update() {
    console.log("update: text = " + this.text);
    this.heading.innerText = this.text;
  }
}
*/

/*
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
  <my-element text="Hello" />
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
*/