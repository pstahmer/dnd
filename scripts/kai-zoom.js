let attack_dialog_html=`
  <h1 style="border: none;"><img src="systems/dnd5e/icons/items/weapons/sword-long.jpg" style="height: 32px; vertical-align: bottom; margin-bottom: 2px;"/> Pew! Pew! Pew!</h1>
  <p>
    ZOOM ZOOM
  </p>
  <label for="kai-advantage">Advantage</label>
  <input type="checkbox" id="kai-advantage" />
  <label for="kai-disadvantage">Disadvantage</label>
  <input type="checkbox" id="kai-disadvantage" />
  <p>
    <strong>How times are you attacking?</strong>
  </p>
`;
let damage_dialog_html=`
  <h1 style="border: none;"><img src="systems/dnd5e/icons/items/weapons/sword-long.jpg" style="height: 32px; vertical-align: bottom; margin-bottom: 2px;"/> Pew! Pew! Pew!</h1>
  <p>
    ZOOM ZOOM HIT 'EM WITH A BROOM
  </p>
  <p>
    <strong>How times did your attacks hit?</strong>
  </p>
  <label for="kai-planar-warrior">Planar Warrior</label>
  <input type="checkbox" id="kai-planar-warrior" />
  <label for="kai-planar-warrior">Hunter's Mark</label>
  <input type="checkbox" id="kai-hunters-mark" checked/>
`;

async function attack(hits) {
  const adv = document.getElementById('kai-advantage').checked;
  const disAdv = !adv && document.getElementById('kai-disadvantage').checked;

  const advModifier = adv ? 'kh' : disAdv ? 'kl' : '';
  const str = 3, prof = 3;
  let rolls = [];
  for (let i = 0; i < hits; i++) {
    rolls.push(
      await new Roll(
        `${advModifier.length ? 2 : 1}d20${advModifier} + @prof + @str`,
        {prof, str}
      ).evaluate({async: true})
    );
  }

  let getRollHtml = (i) => `
    <div class="dnd5e chat-card">
      <header class="card-header flexrow">
        <img src="systems/dnd5e/icons/items/weapons/sword-long.jpg" title="Magic Missile" width="36" height="36" />
        <h3>Kai's Attack (Roll ${i + 1})</h3>
      </header>
      <div class="card-content br-text">
        <button class="kai-damage-link">Roll Damage</button>
      </div>
    </div>
  `;

  rolls.forEach((r, i) => r.toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: getRollHtml(i),
  }));
  setTimeout(() => {
    const buttons = document.getElementsByClassName('kai-damage-link');
    Array.from(buttons).forEach(button => {
      button.addEventListener('click', damageDialog);
    });
  }, 1250);
};

async function damageDialog() {
  new Dialog({
    title: `Kai's Zoom Damage`,
    content: damage_dialog_html,
    buttons: {
      one: {
        label:`1`,
        callback: damage.bind(null, 1)
      },
      two: {
        label:`2`,
        callback: damage.bind(null, 2)
      }
    },
  }, { id: "kai-zoom-roll"}).render(true);
};

async function damage(hits) {
  const planar = document.getElementById('kai-planar-warrior').checked;
  const planarStr = planar ? '1d8[Force] + ' : '';
  const weaponType = planar ? 'Force' : 'Slashing';
  const hunter = document.getElementById('kai-hunters-mark').checked;
  const hunterStr = hunter ? `${hits}d6[${weaponType}] + ` : '';
  const roll = await new Roll(`${hits}d8[${weaponType}] + ${hunterStr}${planarStr} ${5 * hits}`).evaluate({async: true});
  let zoom = '';
  for (let i = 0; i < hits; i++) {
    zoom += 'zoom ';
  }

  let flavor_html = `
    <div class="dnd5e chat-card">
      <header class="card-header flexrow">
        <img src="systems/dnd5e/icons/items/weapons/sword-long.jpg" title="Zoom" width="36" height="36" />
        <h3>Kai's ${zoom} (Damage)</h3>
      </header>
      <div class="card-content br-text">
        <p>
          You just got zoomed by Kai the Swift
        </p>
      </div>
    </div>
  `;

  roll.toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: flavor_html,
  });
}

new Dialog({
  title: `Zoom Zoom`,
  content: attack_dialog_html,
  buttons: {
    one: {
      label:`1`,
      callback: attack.bind(null, 1)
    },
    two: {
      label:`2`,
      callback: attack.bind(null, 2)
    }
  },
}, { id: "kai-zoom-roll"}).render(true);
