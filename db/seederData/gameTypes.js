module.exports = {
    gameTypes: [
        {
            name: "volleyball",
            bools: ['setter', 'middle', 'right side', 'outside', 'libero', 'twos', 'fours', 'sixes'],
            skills: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: "tennis",
            bools: ["singles", "doubles", "Canadian doubles", "men's", "women's", "mixed", "ungendered"],
            skills: ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"],
        },
        {
            name: "flag football",
            bools: ["4 on 4", "7 on 7", "8 on 8", "men's", "women's", "mixed", "quarterback", "receiver", "defense", "line", "running back"],
            skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "basketball",
            bools: ["3 on 3", "5 on 5"],
            skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "12-inch softball",
            bools: ["men's", "women's", "mixed", "infield", "outfield", "pitcher", "catcher"],
            skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "16-inch softball",
            bools: ["men's", "women's", "mixed", "infield", "outfield", "pitcher", "catcher"],
            skills: ["beginner", "intermediate", "advanced"],
        },
        {
            name: "soccer",
            bools: ["men's", "women's", "mixed"],
            skills: ["beginner", "intermediate", "advanced"],
        }
    ],
};
