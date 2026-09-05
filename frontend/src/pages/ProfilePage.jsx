import React from "react";

const user = {
    display_name: "Nicholas Lee",
    username: "nickmeister123",
    email: "cindylee@example.com",
    level: 10,
};

const levelTitlePicker = (level) => {
    switch (true) {
        case (level <= 0):
            return "Loot Learner";
        case (0 < level && level <= 3):
            return "Nickel Knower";
        case (3 < level && level <= 6):
            return "Dollar Dweller"; 
        case (6 < level && level <= 9):
            return "Currency Crusher";
        case (9 < level && level <= 14):
            return "Cash Cultivator"; 
        case (14 < level && level <= 19):
            return "Money Master";
        case (level == 20):
            return "Penny Wise"; 
        default:
            return "Loot Learner";
    }
}

const ProfilePage = () => {
  return (
    <>
      {/*This is where NavBar is going to be
      with the Header and the NavLinks for Sign-up and Log-in*/}
      <main>
        
        <section className="profileContent">
          <div className="profilePictureHolder">

          </div>
          <div className="userInfo">
            <h1>{user.display_name}</h1>
            <p>{user.username}</p>
            <p>{user.email}</p>
          </div>
        </section>

        <section className="levelBanner">
          <h3>LEVEL {user.level}</h3>
          <p>{levelTitlePicker(user.level)}</p>
        </section>
      </main>

      {/*This is where the Footer is going to be*/}
    </>
  );
};

export default ProfilePage;
