class WarunkowaConditionalCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    if (!this.card) {
      const card = hass.createCard(this.config.card);
      this.card = card;
      this.shadowRoot.appendChild(card);
    }

    this.card.hass = hass;

    const entityId = this.config.entity;
    const condition = this.config.condition;
    const value = parseFloat(this.config.value);

    const entityState = parseFloat(hass.states[entityId].state);

    let shouldDisplay = false;
    switch (condition) {
      case 'above':
        shouldDisplay = entityState > value;
        break;
      case 'below':
        shouldDisplay = entityState < value;
        break;
    }

    // Set display style based on whether the card should be shown or not
    this.card.style.display = shouldDisplay ? 'block' : 'none';
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
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('warunkowa-conditional-card', WarunkowaConditionalCard);