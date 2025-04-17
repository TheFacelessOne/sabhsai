export default function (wallaby) {
    return {
        compilers: {
            "**/*.ts?(x)": wallaby.compilers.typeScript({
                module: "commonjs",
            }),
        },
        fileScanMethod: "poll",
        runMode: "onsave",
        tests: ["test/unit/*.test.ts", "test/integration/*.test.ts"],
    };
}
