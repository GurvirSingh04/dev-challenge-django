# Finimize dev challenge

## Python & Django setup

* Install `python3` via brew
* Clone the repo
* cd into repo
* Install `virtualenv` using `pip3` (think yarn)

```sh
sudo pip3 install virtualenv
```

* Create a virtualenv for the project

```sh
virtualenv -p python3 venv
```

If you're having trouble completing this step, try upgrading virtualenv first `pip3 install --upgrade virtualenv`

* Activate the virtualenv

```sh
source venv/bin/activate
```

* Install dependencies in the new virtualenv

```
pip3 install -r requirements.txt
```

```
python3 manage.py runserver
```

* Server should be running at http://localhost:8000


 ## Client setup

 * cd into `frontend` and run `yarn install`

 * Run `yarn start`. 

The webapp should now be running at http://localhost:3000 🚀


## The challenge

Create a web-app that shows how much you can expect to make from your savings
over time.

The app must satisfy the following Acceptance Criteria (ACs):

* It should allow the user to vary the initial savings amount, monthly deposit and interest rate through the UI
* It should display how much the user's initial savings amount will be worth
  over the next 50 years, to a monthly precision. This should assume that the monthly amount is paid in each month, and the value rises with the interest rate supplied.
* It should allow the user to select how often interest is paid - either 'Monthly', 'Quarterly' or 'Annually'
* It should allow the user to optionally select another currency to display the results in. If this is selected, it should convert the results using the latest exchange rate from GBP via a 3rd party API (e.g. [Fixer](http://fixer.io/))
* All calculations must take place server-side, and all monthly projection data should be returned via an endpoint
* The calculations must be triggered onChange of any input, to give live feedback on the input data. The performance (try the slider) should be reasonable.
* You should manage app state using Redux (even though it is arguably overkill in this particular case)

### Our Guidance

The challenge should not take any more than 2-4 hours. You do not need to complete the challenge in one go.

We are keen to see how much you think is enough, and how much would go into a Minimum Viable Product. As a guide, elegant and simple wins over feature rich every time.

Do you test drive your code? This is something we value - any indicator of BDD/TDD would make us smile.

Although the API might be returning relatively straightforward content, please try and write the API code as if you were building something more complex. We would like to gain an idea of how you would go about structuring API code.

Feel free to make any changes to the UI you see fit.

When you are finished, you should send us a link to the codebase, preferably via git (e.g. github) showing multiple commits, so we can see its evolution.

### Tooling

The frontend contains some tooling you might be familiar with

#### Typescript

If you like to use Typescript in your workflow, you should get any warnings/errors appear in your terminal after running `yarn start`

#### Prettier

We believe Prettier makes your life easier! There is an example .prettierrc included in the `frontend` directory - feel free to tweak the settings if you'd prefer.

You might need to give your IDE a nudge to pick the settings up - [here's an example](https://stackoverflow.com/a/58669550/4388938) of how to do that with VS Code
