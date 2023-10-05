import { makeAutoObservable } from "mobx"

export class Attribute {
  public name: string;
  public spentPoints: number = 0;

  get modifier() {
    return Math.trunc((this.spentPoints - 10) * 0.5);
  }

  constructor(name: string) {
    makeAutoObservable(this);
    this.name = name;
  }

  public toJSON() {
    return {
      name: this.name,
      spentPoints: this.spentPoints,
      modifier: this.modifier,
    }
  }
}