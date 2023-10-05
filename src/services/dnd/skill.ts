import { makeAutoObservable } from "mobx"
import { Attribute } from "./type.ts";

export class Skill {
  public name: string;
  public spentPoints: number = 0;
  private attribute: Attribute;

  get desiredLevel() {
    return this.spentPoints + this.attribute.modifier;
  }

  constructor(name: string, attribute: Attribute) {
    makeAutoObservable(this);
    this.name = name;
    this.attribute = attribute;
  }

  public toJSON() {
    return {
      name: this.name,
      spentPoints: this.spentPoints,
      attributeModifier: this.attribute.name,
      desiredLevel: this.desiredLevel,
    }
  }
}