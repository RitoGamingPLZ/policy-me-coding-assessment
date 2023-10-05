import { makeAutoObservable } from "mobx"
import { Attribute, Character, CharacterDefaultJSON } from './type.ts';
import { getData, updateData } from "./storage.ts";

export class DNDManager {
  public party: Party = new Party();
  public classes: Map<string, any> = new Map<string, any>();
  public skills: any[] = [];

  public dcEntity: string;
  public dcSkill: string;
  public dc: number;


  public lastRollResult;
  public previewClass: any;

  constructor() {
    makeAutoObservable(this);
  }

  public importClasses(json: Record<string, any>) {
    Object.keys(json).forEach((key) => {
      this.classes.set(key, json[key]);
    })
    // console.log(this.classes)
  }

  public importSkills(array: any[]) {
    this.skills = array;
  }

  public setPreviewClass(value: any) {
    this.previewClass = value;
  }

  public selectDcEntity(option: any) {
    // console.log(value)
    this.dcEntity = option.value;
  }

  public selectDcSkill(option: any) {
    // console.log(value)
    this.dcSkill = option.value;
  }

  public updateDc(value: number) {
    this.dc = value;
  }

  private getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  public deleteCharacter(character) {
    this.party.deleteCharacter(character);
    this.dcEntity = 'party';
  }

  public addCharacter() {
    this.party.characters.push(new Character().import(CharacterDefaultJSON));
  }
  public async load() {
    try {
      const data = await getData();
      this.party.import(data.body);
    } catch (e) {
      console.log(e);
      this.party.characters = [new Character().import(CharacterDefaultJSON)];
    }
  }

  public save() {
    const json = this.party.export();
    updateData(json);
  }

  public roll() {
    if (this.dc == undefined || this.dcEntity == undefined || this.dcSkill == undefined) {
      alert('Invalid Input');
    }

    const skill = this.skills.find((skill) => skill.name === this.dcSkill)?.name;
    if (!skill) {
      alert('Skill not found');
    }

    let dc_character;
    if (this.dcEntity === 'party') {
      // find max
      dc_character = this.party.characters[0];
      this.party.characters.forEach((character) => {
        if (character.skills.get(skill)?.desiredLevel > dc_character.skills.get(skill)?.desiredLevel) dc_character = character;
      })
    } else {
      dc_character = this.party.characters[this.dcEntity + 0];
    }

    console.log(dc_character.skills.get(skill))
    let rolledValue = this.getRandomInt(dc_character.skills.get(skill)?.desiredLevel) + 1;

    this.lastRollResult = {
      result: this.dc > rolledValue ? 'failed' : 'succeed',
      dc: this.dc,
      rolledValue,
      target: dc_character.name
    }

  }

}


export class Party {
  public characters: Character[] = [
  ];

  public editingCharacter: Character;

  constructor() {
    makeAutoObservable(this);
  }

  public import(json) {
    console.log('Party import', json)
    if (json['characters'] === undefined) throw Error('Invalid Json');

    this.characters = json['characters']?.map((characterPayload) => {
      return new Character().import(characterPayload);
    })
    console.log(this.characters)
  }

  public export() {
    return {
      characters: this.characters.map((character) => character.export()),
    }
  }

  public setEditingCharacter(value: Character) {
    this.editingCharacter = value;
  }

  public deleteCharacter(value: Character) {
    if (this.editingCharacter === value) this.editingCharacter = undefined;
    this.characters.splice(this.characters.findIndex((old) => old === value), 1);
  }
}