let attack_dialog_html=`
  <h1 style="border: none;"><img src="/systems/dnd5e/icons/spells/fireball-eerie-1.jpg" style="height: 32px; vertical-align: bottom; margin-bottom: 2px;"/> Pew! Pew! Pew!</h1>
  <p>
    BLAP BLAP PEW PEW
  </p>
  <label for="xano-advantage">Advantage</label>
  <input type="checkbox" id="xano-advantage" />
  <label for="xano-disadvantage">Disadvantage</label>
  <input type="checkbox" id="xano-disadvantage" />
  <p>
    <strong>How times are you attacking?</strong>
  </p>
`;
let damage_dialog_html=`
  <h1 style="border: none;"><img src="/systems/dnd5e/icons/spells/fireball-eerie-1.jpg" style="height: 32px; vertical-align: bottom; margin-bottom: 2px;"/> Pew! Pew! Pew!</h1>
  <p>
    BLAP BLAP PEW PEW
  </p>
  <label for="xano-hex">Hex</label>
  <input type="checkbox" id="xano-hex" />
  <p>
    <strong>How times did your attacks hit?</strong>
  </p>
`;

async function attack(hits) {
  const adv = document.getElementById('xano-advantage').checked;
  const disAdv = !adv && document.getElementById('xano-disadvantage').checked;

  const advModifier = adv ? 'kh' : disAdv ? 'kl' : '';
  const cha = 4, prof = 3;
  let rolls = [];
  for (let i = 0; i < hits; i++) {
    rolls.push(
      await new Roll(
        `${advModifier.length ? 2 : 1}d20${advModifier} + @prof + @cha`,
        {prof, cha}
      ).evaluate({async: true})
    );
  }

  let getRollHtml = (i) => `
    <div class="dnd5e chat-card">
      <header class="card-header flexrow">
        <img src="/systems/dnd5e/icons/spells/fireball-eerie-1.jpg" title="Magic Missile" width="36" height="36" />
        <h3 class="xano-damage-link">Xano's Attack (Roll ${i + 1})</h3>
      </header>
    </div>
  `;

  rolls.forEach((r, i) => r.toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: getRollHtml(i),
  }));
  setTimeout(() => {
    const buttons = document.getElementsByClassName('xano-damage-link');
    Array.from(buttons).forEach(link => {
      link.addEventListener('click', damageDialog);
    });
  }, 1250);
};

async function damageDialog() {
  new Dialog({
    title: `Xano Blap Damage`,
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
  }, { id: "xano-blap-roll"}).render(true);
};

async function damage(hits) {
  const hex = document.getElementById('xano-hex').checked;
  const hexStr = hex ? `${hits}d6[Necrotic] + ` : '';
  let roll = await new Roll(`${hits}d10[Force] + ${hexStr} 3[Thunder] + 4[Force]`).evaluate({async: true});
  let pew = '';
  let blap = '';
  for (let i = 0; i < hits; i++) {
    pew += 'pew ';
    blap += 'blap ';
  }

  let flavor_html = `
    <div class="dnd5e chat-card">
      <header class="card-header flexrow">
        <img src="/systems/dnd5e/icons/spells/fireball-eerie-1.jpg" title="Magic Missile" width="36" height="36" />
        <h3>Xano's ${pew} ${blap} (Damage)</h3>
      </header>
      <div class="card-content br-text">
        <p>
          You just got blapped by Xano the Magnificent
        </p>
      </div>
    </div>
  `;

  roll.toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: flavor_html,
  });
};

new Dialog({
  title: `Xano Blap`,
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
}, { id: "xano-blap-roll"}).render(true);
