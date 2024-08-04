# How It Works: Data Migration from EQ DKP Plus

This guide outlines the data migration process from EQ DKP Plus. The migration process involves several steps designed to seamlessly import user and character data into the system. Note that at this time the migration does not preserve the original transaction history, such as raid attendance, item purchases, etc.

## Running The Migration

### Initialize the Development Environment

First, initialize the development environment by following the instructions in the README. Ensure you include the three optional environment variables necessary for sourcing data from your EQ DKP Plus instance:

- **DB Connection String**: The connection string for your EQ DKP Plus MySQL database.
- **REST API Base URL**: The base URL for the EQ DKP Plus instance.
- **REST API Key**: A read-only API key for accessing the EQ DKP Plus REST API. If you are unsure how to acquire a REST API Key, you can find it in the Admin portal under Raids > Data-Export.

### Run the Migration

Execute the migration by running the following command:

```sh
make db-etl-eqdkp
```

## Migration Steps

1. **Connect to EQ DKP MySQL Database**

   - Establish a connection to the EQ DKP MySQL database using the connection string.

2. **Map Class and Race IDs**

   - Retrieve class and race IDs from the EQ DKP database.
   - Build a mapping between remote IDs and internal IDs.

3. **Retrieve Character Data**

   - Pull all characters from the EQ DKP database along with their current earnings and associated user (owner).

4. **Insert Characters**

   - Insert characters in the local database.
   - Skip characters with invalid names. Create a transaction for them nonetheless, which will require manual intervention to clear or reject.

5. **Upsert Users**

   - Insert or update users in the local database.
   - Retrieve the email address required for user sign-in via Discord using the EQ DKP REST API; this is necessary since the emails are encrypted in the EQ DKP database, but are what is used to identify the same user in both systems.

6. **Create Transactions**
   - Generate a transaction for each user's wallet equivalent to the earned DKP of each character.

## Resulting State

After the migration process, the system will have the following state:

1. **Users in Database**

   - New users with their email addresses will exist in the database. They will not have a complete connection to Discord until the user signs in.

2. **Characters Associated with Users**

   - Characters linked to their respective users.
   - For characters with invalid race/class combinations (since EQ DKP allows "unknown" for race/class), a default race/class (Gnome Warrior, the least played combination) is used. Players may need to manually update their race/class in the system.

3. **Created Transactions**
   - One cleared adjustment transaction is created for each character.

## Post-Migration User Onboarding

When a user signs in with Discord:

- Assuming the user uses the same Discord account matching the email that was in EQ DKP, characters will automatically be assigned to them.
- The transactions will also be automatically applied to their account, unless they had invalid character names.

This seamless integration ensures that users will have their earned points accurately reflected once they log in with Discord.
