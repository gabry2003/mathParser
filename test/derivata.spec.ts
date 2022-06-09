import { expect } from "chai";
import "mocha";
import { derivata } from "../src/derivata";

const funzione = `y=2x^2+3x`;

describe(`Derivative of ${funzione}`, () => {
  const expected = `y'=4x+3`;

  it(`should return "${expected}"`, () => {
    expect(`${derivata(funzione)}`).to.be.equal(`${expected}`);
  });
});
