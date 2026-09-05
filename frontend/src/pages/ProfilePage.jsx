import React from "react";

const user = {
    display_name: "Nicholas Lee",
    username: "tickolas6969",
    email: "cindylee@example.com",
    level: 15,
};

const levelTitlePicker = (level) => {
    switch (level) {
        case (level <= 0):
            return "Buck Baby";
        case (level > 0 && level <= 3):
            return "Nickel Knower";
        case (level > 3 && level <= 6):
            return "Dollar Dweller"; 
        case (level > 6 && level <= 9):
            return "Currency Crusher";
        case (level > 10 && level <= 14):
            return "Cash Cultivator"; 
        case (level > 14 && level <= 19):
            return "Money Master";
        case (level == 20):
            return "Penny Wise"; 
        default:
            return "Buck Baby";
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