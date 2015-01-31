module('Calculator');

test('sum', function () {
    expect(3);
    strictEqual(sum(1, 1), 2);
    strictEqual(sum(5, 0), 5);
    strictEqual(sum(17, 83), 100);
});

test('product', function (assert) {
    expect(3);
    strictEqual(product(1, 1), 1);
    strictEqual(product(5, 0), 0);
    strictEqual(product(17, 83), 1411);
});
