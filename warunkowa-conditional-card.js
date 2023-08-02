import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class WarunkowaConditionalCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    if (!config.condition) {
      throw new Error('You need to define a condition');
    }
    if (!config.value) {
      throw new Error('You need to define a value');
    }
    if (!config.card) {
      throw new Error('You need to define a card');
    }

    this.config = config;
    this.card = config.card;
  }

  shouldUpdate(changedProps) {
    if (changedProps.has('hass')) {
      const entityId = this.config.entity;
      const entityState = parseFloat(this.hass.states[entityId].state);
      const condition = this.config.condition;
      const value = parseFloat(this.config.value);

      let shouldDisplay = false;
      switch (condition) {
        case 'above':
          shouldDisplay = entityState > value;
          break;
        case 'below':
          shouldDisplay = entityState < value;
          break;
      }
      this.shouldDisplay = shouldDisplay;
      this.card.hass = this.hass;
    }
    return LitElement.prototype.shouldUpdate.call(this, changedProps);
  }

  generateCard() {
    return this.shouldDisplay ? this.card : null;
  }

  render() {
    const card = this.generateCard();
    return html`
      ${card}
    `;
  }

  createRenderRoot() {
    return this;
  }

  getCardSize() {
    return this.shouldDisplay ? 1 : 0;
  }
}

customElements.define('warunkowa-conditional-card', WarunkowaConditionalCard);