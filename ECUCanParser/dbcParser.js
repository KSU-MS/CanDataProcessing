const fs = require("fs");

fs.readFile("data.dbc", (err, file) => {
    const data = file.toString("utf8");
    // console.log(file.toString("utf8"));
    const groups = data.split("BO_ ").map(d => {
        let groupId = [...d.match(/([0-9]{4})/) || []][0];
        // if (!groupId[1]) return null;
        // groupId = parseInt(groupId[1]) - 1520;
        let signals = [...d.matchAll(/ SG_ ([A-z0-9_]+) : (\d+)\|(\d+)@0(\+|-) \(([0-9.]+),([0-9.]+)\) \[0\|0\] "([^"]*)"/g)];
        signals = signals
            .map(([match, name, startByte, size, signed, scale, offset, units]) => ({ groupId: groupId - 520, name, startByte: (parseInt(startByte) - 7) / 8, size: size / 8, signed: signed === "-" ? 1 : 0, scale, offset, units }));
        // console.log(groupId);
        // console.log(signals);
        // console.log(signals.map(s => s.offset));
        return signals;
    });
    const allSignals = "groupId,name,startByte,size,signed,scale,offset,units\n" + groups
        .reduce((a, g) => [...a, ...g], [])
        .sort((a, b) => a.groupId - b.groupId)
        .map(({ groupId,
            name,
            startByte,
            size,
            signed,
            scale,
            offset,
            units }) => `${groupId},${name},${startByte},${size},${signed},${scale},${offset},${units}`).join("\n");


    console.log(allSignals);
    console.log(allSignals.length);
    fs.writeFileSync('msqSignals.csv', allSignals);
});

