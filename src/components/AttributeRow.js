function AttributeRow({ character, attribute }) {
  return (
    <div key={attribute.name} className="flex items-center space-x-2">
      <p className="w-32 text-sm text-left">{attribute.name}</p>
      <button
        className="flex justify-center items-center w-5 h-5 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 border border-white"
        disabled={attribute.spentPoints <= 0}
        onClick={() => character.updateAttribute(attribute.name, -1)}
      >
        <p>-</p>
      </button>
      <button
        className="flex justify-center items-center w-5 h-5 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-50 border border-white"
        disabled={character.remainingAttrPoint <= 0}
        onClick={() => character.updateAttribute(attribute.name, +1)}
      >
        <p>+</p>
      </button>

      <p className="w-6">{attribute.spentPoints}</p>
      <p className="w-6 text-right">({attribute.modifier})</p>
    </div>
  );
}

export default AttributeRow;
