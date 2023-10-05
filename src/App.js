import { useEffect, useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";
import Select from "react-select";
import { observer } from "mobx-react-lite";
import { Character, CharacterDefaultJSON } from "./services/dnd/type.ts";

import SkillRow from "./components/SkillRow.js";
import AttributeRow from "./components/AttributeRow.js";
import { DNDManager } from "./services/dnd/type.ts";
import { getData } from "./services/dnd/storage.ts";

const dndManager = new DNDManager();
function App() {
  // const [activeCharacter, setActiveCharacter] = useState(null);

  useEffect(() => {
    dndManager.importClasses(CLASS_LIST);
    dndManager.importSkills(SKILL_LIST);
    dndManager.load();
  }, []);

  const CharacterView = observer(({ character }) => {
    return (
      <div className="relative flex-1 flex border border-white divide-x">
        {/* Information */}
        <div className="flex flex-col divide-y-2">
          <div className="flex flex-col items-start ">
            <p>
              Name: <input className="bg-transparent ring-0 outline-none" value={character.name} onInput={(evt) => (character.name = evt.target.value)} maxLength={30} />
            </p>
          </div>
          {/* Attribute */}
          <div className="flex flex-col items-start ">
            <p>
              Attribute: {character.remainingAttrPoint} / {character.maxAttrPoint}
            </p>
            {[...character.attributes.values()].map((attribute) => {
              return <AttributeRow character={character} attribute={attribute} />;
            })}
          </div>
          {/* classes */}
          <div className="flex flex-col items-start">
            <p>Classes:</p>
            {[...dndManager.classes.entries()].map(([key, baseclass]) => {
              const validate = character.validate({
                attributes: baseclass,
              });
              return (
                <div className={`${validate ? "" : "opacity-50"} text-sm`} onClick={() => dndManager.setPreviewClass([key, baseclass])}>
                  {key}
                </div>
              );
            })}
            {dndManager.previewClass && (
              <div className="flex flex-col items-start">
                <p className="text-sm">{dndManager.previewClass[0]}'s requirment: </p>
                {Object.keys(dndManager.previewClass[1]).map((key) => {
                  return (
                    <p className="text-xs text-left">
                      {key}: >={dndManager.previewClass[1][key]}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Skill */}
        <div className="flex flex-col divide-y-2">
          {/* Skills */}
          <div className="flex flex-col items-start divide-y">
            <p>
              Skills: {character.remainingSkillPoint} / {character.maxSkillPoint}
            </p>
            {[...character.skills.values()].map((skill) => {
              return <SkillRow character={character} skill={skill} />;
            })}
          </div>
        </div>
        {/* Skill roll */}
        {character.invalid && <div className="absolute inset-0 bg-red/50 pointer-events-none"></div>}
      </div>
    );
  });

  const DNDView = observer(({ dndManager }) => {
    const options = [
      {
        value: "party",
        label: "Party",
      },
      ...dndManager.party.characters.map((character, index) => {
        return {
          value: index,
          label: character.name,
        };
      }),
    ];
    const skills = dndManager.skills.map((skill) => {
      return {
        value: skill.name,
        label: skill.name,
      };
    });
    return (
      <div className="flex flex-col h-full">
        <div className="relative border border-white h-32 w-full">
          <button className="absolute top-2 right-2 w-12 bg-white text-black active:opacity-50" onClick={() => dndManager.save()}>
            save
          </button>
          <p>DC roll</p>
          <div className="flex space-x-1">
            <div className="flex flex-col items-start w-48">
              <p>Choose a character:</p>
              <Select className="w-full text-black text-sm" options={options} onChange={(value) => dndManager.selectDcEntity(value)} />
            </div>

            <div className="flex flex-col items-start w-48">
              <p>Choose a skill:</p>
              <Select className="w-full text-black text-sm" options={skills} onChange={(value) => dndManager.selectDcSkill(value)} />
            </div>

            <div className="flex flex-col items-start w-48">
              <p>Enter a DC:</p>
              <input max={40} min={0} className="text-black w-full rounded-sm p-1.5" type="number" onInput={(evt) => dndManager.updateDc(evt.target.value)} />
            </div>

            <div className="flex flex-col justify-center items-start w-48">
              <button className="w-12 h-6 rounded-sm bg-white text-black active:opacity-50" onClick={() => dndManager.roll()}>
                {" "}
                roll
              </button>
            </div>
          </div>

          {/* Result */}
          <div>{JSON.stringify(dndManager.lastRollResult)}</div>
        </div>
        <div className="flex flex-1">
          <div className="h-full w-36 line-clamp-1 flex flex-col border border-white  divide-y">
            {/* Character list */}
            {dndManager.party.characters.map((character, index) => {
              return (
                <div key={index} className="flex justify-between items-center">
                  <button key={index} onClick={() => dndManager.party.setEditingCharacter(character)}>
                    {character.name}
                  </button>
                  <button className="flex w-4 h-4 bg-red-500  justify-center items-center" onClick={() => dndManager.deleteCharacter(character)}>
                    <p>-</p>
                  </button>
                </div>
              );
            })}
            <button className="flex h-6 w-full bg-green-500  justify-center items-center" onClick={() => dndManager.addCharacter()}>
              <p>+</p>
            </button>
          </div>
          {dndManager.party.editingCharacter && <CharacterView character={dndManager.party.editingCharacter} />}
        </div>
      </div>
    );
  });

  return (
    <div className="App h-screen flex flex-col">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section flex-1 ">
        <DNDView dndManager={dndManager} />
      </section>
    </div>
  );
}

export default App;
