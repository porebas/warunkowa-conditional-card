customElements.whenDefined('card-tools').then(() => {
  var ct = customElements.get('card-tools');

  class WarunkowaConditionalCard extends ct.LitElement {

    static get properties() {
      return {
        config: {},
        hass: {},
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
      this.card = ct.createCard(config.card);
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
      return ct.LitElement.prototype.shouldUpdate.call(this, changedProps);
    }

    render() {
      if (!this.shouldDisplay) {
        return null;
      }
      return ct.LitHtml `
        <ha-card>
          ${ct.LitHtml `${this.card}`}
        </ha-card>
      `;
    }

    getCardSize() {
      return this.card.getCardSize();
    }

  }

  customElements.define('warunkowa-conditional-card', WarunkowaConditionalCard);

});
