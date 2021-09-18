let Skills = ["beginner", "HS JV", "HS varsity", "D3 college", "D1 college"];
module.exports = {
    sports: [
        {
            Name: "12-inch softball",
            boolTypes: {positions: ["infield", "outfield", "pitcher", "catcher"]},
            Skills,
        },
        {
            Name: "16-inch softball",
            boolTypes: {positions: ["infield", "outfield", "pitcher", "catcher"]},
            Skills,
        },
        {
            Name: "Basketball",
            boolTypes: {sizes: ["3 on 3", "5 on 5"]},
            Skills,
        },
        {
            Name: "Biking",
            boolTypes: {distances: ["10 miles", "15 miles", "20 miles", "30 miles"]},
        },
        {
            Name: "Cross-country skiing",
            boolTypes: {distances: ["5K", "7K", "10K", "15K"]},
        },
        {
            Name: "Flag football",
            boolTypes: {
                sizes: ["4 on 4", "7 on 7", "8 on 8"],
                positions: ["QB", "receiver", "defense", "line", "running back"],
            },
            Skills,
        },
        {
            Name: "Running",
            boolTypes: {distances: ["5K", "7K", "10K", "15K"]},
            // Skills: ["5K/19min or 10K/40min or 10mi/66min"]
        },
        {
            Name: "Sailboat racing",
            boolTypes: {classes: ["laser", "420", "470", "catamaran"]},
        },
        {
            Name: "Soccer",
            boolTypes: {positions: ["goalie", "defense", "midfield", "forward", "wing"]},
            Skills,
        },
        {
            Name: "Tennis",
            boolTypes: {sizes: ["singles", "doubles", "Canadian doubles"]},
            Skills: ["2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"],
        },
        {
            Name: "Ultimate",
            boolTypes: {positions: ["cutter", "handler"]},
        },
        {
            Name: "Volleyball",
            boolTypes: {
                positions: ['setter', 'middle', 'right side', 'outside', 'libero'],
                sizes: ['twos', 'fours', 'sixes'],
            },
            Skills,
        },
    ],
};
