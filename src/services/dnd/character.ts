import { makeAutoObservable } from "mobx"
import { Attribute, Skill } from './type.ts';

export class Character {
  // the attribute distribution
  public maxAttrPoint: number = 70;
  // public remainingAttrPoint: number = 0;
  public spentAttrPoint: number = 0;
  public attributes: Map<string, Attribute> = new Map<string, Attribute>();

  get remainingAttrPoint() {
    return this.maxAttrPoint - this.spentAttrPoint;
  }

  // skill point distribution
  public skills: Map<string, Skill> = new Map<string, Skill>();
  // public maxSkillPoint: number = 0;
  public spentSkillPoint: number = 0;
  get maxSkillPoint() {
    return 10 + (this.attributes.get('Intelligence')?.spentPoints ?? 0);
  }
  get remainingSkillPoint() {
    return this.maxSkillPoint - this.spentSkillPoint;
  }

  get invalid() {
    return this.remainingAttrPoint < 0 || this.remainingSkillPoint < 0;
  }

  // selected class
  public class: string;
  public name: string;

  constructor() {
    makeAutoObservable(this);
  }

  public import(json: Map<string, any>) {
    // Character.verifyPropertyExist(json, 'maxAttrPoints');
    Character.verifyPropertyExist(json, 'attributes');
    Character.verifyPropertyExist(json, 'skills');

    this.maxAttrPoint = json['maxAttrPoints'] ?? 70;
    this.spentAttrPoint = 0;

    this.name = json['name'];

    Object.keys(json['attributes']).forEach((key) => {
      this.attributes.set(key, new Attribute(key));
      this.updateAttribute(key, json['attributes'][key]);
    })

    Object.keys(json['skills']).forEach((key) => {
      const { spentPoints, attributeModifier } = json['skills'][key];
      let attribute = this.attributes.get(attributeModifier);
      if (!attribute) Character.onError(`Attribute ${key} not found`);
      this.skills.set(key, new Skill(key, attribute));
      this.updateSkill(key, spentPoints ?? 0);
    })

    return this;
  }

  public export() {
    let attributes = [...this.attributes.entries()].reduce(
      (collection, [key, attribute]) => {
        return {
          ...collection,
          [key]: attribute.spentPoints,
        }
      }, {})
    let skills = [...this.skills.entries()].reduce(
      (collection, [key, skill]) => {
        return {
          ...collection,
          [key]: {
            attributeModifier: skill.attribute.name,
            spentPoints: skill.spentPoints
          },
        }
      }, {})
    return {
      name: this.name,
      maxAttrPoint: this.maxAttrPoint,
      attributes,
      skills
    }
  }

  static verifyPropertyExist(json: Map<string, any>, key: string) {
    if (!json[key]) Character.onError(`Invalid JSON format - attributes ${key} missing`);
  }

  public updateAttribute(key: string, point: number) {
    let attribute = this.attributes.get(key);
    if (!attribute) Character.onError(`Attribute ${key} not found`);
    if (point > 0 && this.remainingAttrPoint < point) Character.onError('Not enough attribute point')
    const targetValue = attribute.spentPoints + point;
    if (targetValue < 0) Character.onError('Cannot have negative point');
    this.spentAttrPoint += point;
    attribute.spentPoints = targetValue;

    return this;
  }

  public validate(json: RequirmentCheck): boolean {
    let result = true;
    if (json.attributes)
      Object.keys(json.attributes).forEach((key) => {
        if (this.attributes.get(key).spentPoints < json.attributes[key]) {
          result = false;
        }
      })

    if (json.skills)
      Object.keys(json.skills).forEach((key) => {
        if (this.skills.get(key).desiredLevel < json.skills[key]) {
          result = false;
        }
      })
    return result
  }

  public updateSkill(key: string, point: number) {
    let skill = this.skills.get(key);
    if (!skill) Character.onError(`Skill ${key} not found`);
    if (point > 0 && this.remainingSkillPoint < point) Character.onError('Not enough skill point')


    const targetValue = skill.spentPoints + point;
    if (targetValue < 0) Character.onError('Cannot have negative point');
    // this.remainingSkillPoint -= point;
    this.spentSkillPoint += point;
    skill.spentPoints = targetValue;
    return this;
  }

  static onError(error: string) {
    throw Error(error);
  }
}

export type RequirmentCheck = {
  attributes: Record<string, any>
  skills: Record<string, any>
}

export const CharacterDefaultJSON = {
  name: "Demo Character",
  attributes: {
    'Strength': 10,
    'Dexterity': 10,
    'Constitution': 10,
    'Intelligence': 10,
    'Wisdom': 10,
    'Charisma': 10,
  },
  maxAttrPoints: 70,
  skills: {
    "Acrobatics": {
      attributeModifier: "Dexterity"
    },
    "Animal Handling": {
      attributeModifier: "Wisdom"
    },
    "Arcana": {
      attributeModifier: "Intelligence"
    },
    "Athletics": {
      attributeModifier: "Strength"
    },
    "Deception": {
      attributeModifier: "Charisma"
    },
    "History": {
      attributeModifier: "Intelligence"
    },
    "Insight": {
      attributeModifier: "Wisdom"
    },
    "Intimidation": {
      attributeModifier: "Charisma"
    },
    "Investigation": {
      attributeModifier: "Intelligence"
    },
    "Medicine": {
      attributeModifier: "Wisdom"
    },
    "Nature": {
      attributeModifier: "Intelligence"
    },
    "Perception": {
      attributeModifier: "Wisdom"
    },
    "Performance": {
      attributeModifier: "Charisma"
    },
    "Persuasion": {
      attributeModifier: "Charisma"
    },
    "Religion": {
      attributeModifier: "Intelligence"
    },
    "Sleight of Hand": {
      attributeModifier: "Dexterity"
    },
    "Stealth": {
      attributeModifier: "Dexterity"
    },
    "Survival": {
      attributeModifier: "Wisdom"
    },
  }
}