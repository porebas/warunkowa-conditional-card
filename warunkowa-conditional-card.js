class WarunkowaConditionalCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.padding = '0 16px 16px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

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

    this.content.innerHTML = `
      ${shouldDisplay ? this.config.card : ''}
    `;
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
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('warunkowa-conditional-card', WarunkowaConditionalCard);