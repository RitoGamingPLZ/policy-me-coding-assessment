function SkillRow({ character, skill }) {
  return (
    <div key={skill.name} className="flex items-end space-x-2">
      <div className="w-36 flex flex-col items-start">
        <p className="text-[10px] opacity-70">{skill.attribute.name}</p>
        <p className="text-sm text-left">{skill.name}</p>
      </div>
      <button
        className="flex justify-center items-center w-5 h-5 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 border border-white"
        disabled={skill.spentPoints <= 0}
        onClick={() => character.updateSkill(skill.name, -1)}
      >
        <p>-</p>
      </button>
      <button
        className="flex justify-center items-center w-5 h-5 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 border border-white"
        disabled={character.remainingSkillPoint <= 0}
        onClick={() => character.updateSkill(skill.name, +1)}
      >
        <p>+</p>
      </button>

      <p className="w-6">{skill.spentPoints}</p>
      <p className="w-4 text-right">{skill.attribute.modifier !== 0 && skill.attribute.modifier > 0 ? `+${skill.attribute.modifier}` : skill.attribute.modifier}</p>
    </div>
  );
}

export default SkillRow;
