if (!customElements.get("card-tools")) {
  console.error("Card-tools not found. Please check the installation");
} else {
  var ct = customElements.get("card-tools");
  var LitElement = ct.LitElement;
  var html = ct.LitHtml;

  class WarunkowaConditionalCard extends LitElement {
    static get properties() {
      return {
        hass: {},
        config: {},
      };
    }

    setConfig(config) {
      if (!config.entity) throw new Error("You need to define an entity");
      if (!config.condition) throw new Error("You need to define a condition");
      if (!config.value) throw new Error("You need to define a value");
      if (!config.card) throw new Error("You need to define a card");

      this.config = config;
      this.card = ct.createCard(config.card);
    }

    shouldUpdate(changedProps) {
      if (changedProps.has("hass")) {
        const entityId = this.config.entity;
        const entityState = parseFloat(this.hass.states[entityId].state);
        const condition = this.config.condition;
        const value = parseFloat(this.config.value);

        let shouldDisplay = false;
        switch (condition) {
          case "above":
            shouldDisplay = entityState > value;
            break;
          case "below":
            shouldDisplay = entityState < value;
            break;
        }

        if (shouldDisplay) {
          this.appendChild(this.card);
        } else {
          if (this.contains(this.card)) {
            this.removeChild(this.card);
          }
        }

        this.card.hass = this.hass;
      }

      return LitElement.prototype.shouldUpdate.call(this, changedProps);
    }

    render() {
      return html``;
    }

    getCardSize() {
      if (this.contains(this.card)) {
        return this.card.getCardSize();
      }
      return 0;
    }
  }

  customElements.define("warunkowa-conditional-card", WarunkowaConditionalCard);
}