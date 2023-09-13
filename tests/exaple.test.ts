function suma(x: number, y: number): number {
    return x+y;
}

describe("suma()", () => {
    it("Suma de dos numeros positivos", () => {
        expect(suma(2, 3)).toBe(5);
    });

    it("Suma de dos numeros negativos", () => {
        expect(suma(-2, -3)).toBe(-5);
    })
})

// para ejecutar los test correr el siguiente comando.
// npx jest
