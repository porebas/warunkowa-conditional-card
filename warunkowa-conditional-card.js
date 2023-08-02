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
      }
      return ct.LitElement.prototype.shouldUpdate.call(this, changedProps);
    }
  
    render() {
      if (!this.shouldDisplay) {
        return ct.LitHtml ``;
      }
      return ct.LitHtml `
        <ha-card>
          <div>
            <h1>To jest twoja karta</h1>
            <p>Wyświetla się tylko wtedy, gdy warunek jest spełniony.</p>
          </div>
        </ha-card>
      `;
    }
  
    getCardSize() {
      return 1;
    }
  
  }
  
  customElements.define('warunkowa-conditional-card', WarunkowaConditionalCard);
  
});