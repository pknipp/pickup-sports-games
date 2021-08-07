module.exports = {
    gameTypes: [
        {
            name: "volleyball",
            positions: ['setter', 'middle', 'right side', 'outside', 'libero'],
            sizes: ['twos', 'fours', 'sixes'],
            // skills: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: "tennis",
            sizes: ["singles", "doubles", "Canadian doubles"],
            // "men's", "women's", "mixed", "ungendered"],
            skills: ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"],
        },
        {
            name: "flag football",
            sizes: ["4 on 4", "7 on 7", "8 on 8"],
            // , "men's", "women's", "mixed",
            positions: ["quarterback", "receiver", "defense", "line", "running back"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "basketball",
            sizes: ["3 on 3", "5 on 5"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "12-inch softball",
            positions: ["infield", "outfield", "pitcher", "catcher"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "16-inch softball",
            positions: ["infield", "outfield", "pitcher", "catcher"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "soccer",
            positions: ["goalie", "defense", "midfield", "forward", "wing"]
            // bools: ["men's", "women's", "mixed"],
            // skills: ["beginner", "intermediate", "advanced"],
        }
    ],
};
