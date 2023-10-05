import AttributeRow from "./AttributeRow";
import SkillRow from "./SkillRow";
import { observer } from "mobx-react-lite";

function CharacterSheet({ character }) {
  const AttributeView = observer(({ character, attribute }) => {
    return <AttributeRow character={character} attribute={attribute} />;
  });
  return (
    <div className="flex flex-col h-full">
      <div className="border border-white h-32 w-full">{/* Roll Event */}</div>
      <div className="flex flex-1">
        <div className="h-full border border-white">
          {/* Character list */}

          <p>{character.name}</p>
        </div>
        <div className="relative flex-1 flex border border-white">
          {/* Information */}{" "}
          <div className="flex flex-col divide-y-2">
            {/* Attribute */}
            <div className="flex flex-col items-start">
              <div>
                Attribute: {character.remainingAttrPoint} / {character.maxAttrPoint}
              </div>
              {[...character.attributes.values()].map((attribute) => {
                return <AttributeView character={character} attribute={attribute} />;
              })}
            </div>

            {/* Skills */}
            <div className="flex flex-col items-start">
              <p>
                Skills: {character.remainingSkillPoint} / {character.maxSkillPoint}
              </p>
              {[...character.skills.values()].map((skill) => {
                return <SkillRow character={character} skill={skill} />;
              })}
            </div>
          </div>
          {character.invalid && <div className="absolute inset-0 bg-red/50 pointer-events-none"></div>}
        </div>
      </div>
    </div>
  );
}

export default CharacterSheet;
