import User from "../data/User";
import { SEX } from "../data/Sex";
import { FormEvent, useEffect, useRef, useState } from "react";

interface ProfileProps {
    user: User;
}

const Profile = ({ user }: ProfileProps) => {
    const genders = Object.keys(SEX);
    const [username, setUsername] = useState(user.username);
    const [lastName, setLastName] = useState(user.last_name);
    const [firstName, setFirstname] = useState(user.first_name);

    const gender = useRef<HTMLSelectElement | null>(null);
    const password = useRef<HTMLInputElement | null>(null);
    const emailAddress = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // Check length
        if (firstName.length < 3 || lastName.length < 3) {
            setUsername("Not Enough Characters".toUpperCase());
            return;
        }

        const newUsername =
            firstName.substring(0, 3).toUpperCase() +
            lastName.substring(0, 3).toUpperCase();
        setUsername(newUsername);
    }, [firstName, lastName]);

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newUser: User = {
            profile_image_url: user.profile_image_url,
            first_name: firstName,
            last_name: lastName,
            username,
            gender: gender.current?.value as SEX,
            email_address: emailAddress.current?.value as string,
            password: password.current?.value as string,
        };

        console.log("User", newUser);

        alert("Form submitted successfully");
    };

    console.log("User", user);

    return (
        <section id="profile" className="flex flex-col mt-8 min-h-[80vh]">
            <p className="font-bold text-white text-3xl text-center uppercase">
                View <span className="text-gradient">Profile</span> Details
            </p>

            <section className="flex flex-row justify-center items-center gap-8 p-10 profile-details grow">
                <div className="flex justify-center w-[30%]">
                    <div className="profile-picture">
                        <div className="overlay"></div>
                        <img
                            src={user.profile_image_url}
                            alt="Profile picture"
                        />
                    </div>
                </div>

                <div className="grow">
                    <form className="profile-form" onSubmit={submitForm}>
                        <div className="flex flex-row justify-start gap-10">
                            <div className="flex flex-col flex-1 first-name">
                                <label htmlFor="first_name">First Name:</label>
                                <input
                                    required
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={firstName}
                                    autoComplete="given-name"
                                    placeholder="Enter First Name..."
                                    onChange={(e) =>
                                        setFirstname(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex flex-col flex-1 last-name">
                                <label htmlFor="last_name">Last Name:</label>
                                <input
                                    required
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={lastName}
                                    autoComplete="family-name"
                                    placeholder="Enter Last Name..."
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-row justify-start gap-10">
                            <div className="flex flex-col flex-1 username">
                                <label htmlFor="username">Username:</label>
                                <input
                                    disabled
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    autoComplete="username"
                                    placeholder="Username will appear here"
                                />
                            </div>

                            <div className="flex flex-col flex-1 gender">
                                <label htmlFor="gender">Gender:</label>
                                <select
                                    id="gender"
                                    ref={gender}
                                    value={user.gender}
                                >
                                    {genders.map((gender, index) => (
                                        <option key={index} value={gender}>
                                            {gender}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-row justify-start gap-10">
                            <div className="flex flex-col flex-1 email-address">
                                <label htmlFor="email_address">
                                    Email Address:
                                </label>
                                <input
                                    required
                                    type="email"
                                    id="email_address"
                                    ref={emailAddress}
                                    name="email_address"
                                    autoComplete="email"
                                    value={user.email_address}
                                    placeholder="Enter Email Address..."
                                />
                            </div>

                            <div className="flex flex-col flex-1 password">
                                <label htmlFor="password">Password:</label>
                                <input
                                    required
                                    id="password"
                                    ref={password}
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    placeholder="Enter Password..."
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="submit-btn"
                                value="submit"
                            >
                                {user ? "Update" : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </section>
    );
};

export default Profile;
