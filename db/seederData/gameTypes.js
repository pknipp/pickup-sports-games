module.exports = {
    gameTypes: [
        {
            Sport: "Volleyball",
            positions: ['setter', 'middle', 'right side', 'outside', 'libero'],
            sizes: ['twos', 'fours', 'sixes'],
            // skills: ['beginner', 'intermediate', 'advanced'],
        },
        {
            Sport: "Tennis",
            sizes: ["singles", "doubles", "Canadian doubles"],
            // "men's", "women's", "mixed", "ungendered"],
            skills: ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"],
        },
        {
            Sport: "Flag football",
            sizes: ["4 on 4", "7 on 7", "8 on 8"],
            // , "men's", "women's", "mixed",
            positions: ["QB", "receiver", "defense", "line", "running back"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            Sport: "Basketball",
            sizes: ["3 on 3", "5 on 5"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            Sport: "12-inch softball",
            positions: ["infield", "outfield", "pitcher", "catcher"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            Sport: "16-inch softball",
            positions: ["infield", "outfield", "pitcher", "catcher"],
            // skills: ["beginner", "intermediate", "advanced"],
        },
        {
            Sport: "Soccer",
            positions: ["goalie", "defense", "midfield", "forward", "wing"]
            // bools: ["men's", "women's", "mixed"],
            // skills: ["beginner", "intermediate", "advanced"],
        }
    ],
};
