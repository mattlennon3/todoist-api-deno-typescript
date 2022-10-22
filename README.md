# Todoist API Deno TypeScript Client

First things first, huge thanks to [Sant123](https://github.com/sant123) who created the [first deno fork](https://github.com/sant123/todoist) of this repo also ported some of the dependencies. I could not have done this without the work you've done!

In this repo, I have forked directly from the official [todoist typescript](https://github.com/Doist/todoist-api-typescript) repo, in the hopes of making merging upstream changes easier in future.

The official repo doesn't seem to fully support the sync API yet. So I have implemented a few functions in the `sync-api` branch. Check out that branch for the sync functionality. 

I have not put sync branch into main as I anticipate Doist will update their main repo with the full sync API soon. So I can just pull that in later.

## Installation

I have not published this to the deno.land package manager yet!
You can clone the repo and import as so:

`yourdenoproject/deps/todoist.ts:`

`export * from "<your git repos>/todoist-api-deno-typescript/mod.ts";`

### Documentation

For more detailed reference documentation, have a look at the
[API documentation with TypeScript examples](https://developer.todoist.com/rest/v2/?javascript).
