customElements.whenDefined('card-tools').then(() => {
  const cardTools = customElements.get('card-tools');

  class ConditionalCard extends cardTools.LitElement {

    static get properties() {
      return {
        config: {},
        hass: {},
      };
    }

    setConfig(config) {
      this.validateConfig(config);
      this.config = config;
      this.card = cardTools.createCard(config.card);
    }

    validateConfig(config) {
      const requiredConfigFields = ['entity', 'condition', 'value', 'card'];
      requiredConfigFields.forEach(field => {
        if (!config[field]) {
          throw new Error(`You need to define a ${field}`);
        }
      });
    }

    shouldUpdate(changedProps) {
      if (changedProps.has('hass')) {
        this.updateDisplayCondition();
        this.card.hass = this.hass;
      }
      return cardTools.LitElement.prototype.shouldUpdate.call(this, changedProps);
    }

    updateDisplayCondition() {
      const { entity, condition, value } = this.config;
      const entityState = this.getEntityState(entity);

      switch (condition) {
        case 'above':
          this.shouldDisplay = entityState > parseFloat(value);
          break;
        case 'below':
          this.shouldDisplay = entityState < parseFloat(value);
          break;
        default:
          this.shouldDisplay = false;
      }
    }

    getEntityState(entityId) {
      const entityState = this.hass.states[entityId];
      if (!entityState) {
        throw new Error(`No state found for entity: ${entityId}`);
      }
      return parseFloat(entityState.state);
    }

    render() {
      if (!this.shouldDisplay) {
        return null;
      }
      return cardTools.LitHtml `
        <ha-card>
          ${cardTools.LitHtml `${this.card}`}
        </ha-card>
      `;
    }

    getCardSize() {
      return this.card.getCardSize();
    }

  }

  customElements.define('conditional-card', ConditionalCard);

});