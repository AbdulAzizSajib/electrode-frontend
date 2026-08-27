## Purpose

Defines how a merchant publishes editorial posts and how shoppers list and read them, including what distinguishes a draft from a published post and how an individual post is addressed so it can be shared.

## ADDED Requirements

### Requirement: Blog posts are merchant-authored, not embedded in code

The storefront's blog posts SHALL be sourced from the merchant's published content rather than from values embedded in the storefront's code.

Each post SHALL carry a title, a short summary, a body, a cover image, an author, a publication date, and the tags the merchant has assigned. A post published, edited, or withdrawn by a merchant MUST be reflected to shoppers without a code change or redeploy.

#### Scenario: Merchant publishes a post

- **WHEN** the merchant publishes a post and a shopper next loads the blog listing
- **THEN** the post appears in the listing
- **AND** no redeploy of the storefront is required

#### Scenario: Merchant edits a published post

- **WHEN** the merchant edits a published post
- **THEN** shoppers subsequently see the edited content

#### Scenario: Merchant withdraws a post

- **WHEN** the merchant withdraws a previously published post
- **THEN** the post no longer appears in the listing
- **AND** the post is no longer readable at its own address

### Requirement: Drafts are invisible to shoppers

A post that has not been published SHALL NOT appear in any listing shown to a shopper, and MUST NOT be readable at its own address by a shopper.

Requesting an unpublished post MUST NOT reveal its title, summary, or body, and MUST NOT disclose that the post exists.

#### Scenario: Draft is absent from the listing

- **WHEN** the merchant has a post in draft
- **THEN** that post does not appear in the blog listing shown to shoppers

#### Scenario: Draft is not readable at its address

- **WHEN** a shopper opens the address of a post that has not been published
- **THEN** the shopper is shown a not-found result
- **AND** no part of the post's content is disclosed

#### Scenario: Draft becomes visible on publication

- **WHEN** the merchant publishes a post that was previously a draft
- **THEN** the post becomes visible in the listing and readable at its address

### Requirement: Each post is individually addressable and readable

Every published post SHALL be readable in full at its own address, and that address SHALL identify the post by a human-readable slug so it is readable and can be shared or bookmarked.

An address that was shared or bookmarked earlier SHALL continue to resolve to the same post while that post remains published.

#### Scenario: Shopper opens a post

- **WHEN** a shopper selects a post from the listing
- **THEN** the shopper is taken to that post's own address
- **AND** the post's full body is shown

#### Scenario: Shared post address resolves

- **WHEN** a shopper opens a post address that was copied or bookmarked earlier and the post is still published
- **THEN** the same post is shown

#### Scenario: Unknown post address

- **WHEN** a shopper opens an address naming a post that does not exist or is no longer published
- **THEN** the storefront does not error
- **AND** the shopper is shown a not-found result

### Requirement: The listing shows real posts, in a stated order, without padding

The blog listing SHALL show only real published posts, presented most recently published first.

The listing MUST NOT repeat a post to fill space, and MUST NOT display invented or placeholder posts. Where more posts exist than are shown at once, the shopper SHALL be able to reach the remainder.

#### Scenario: Listing is ordered by recency

- **WHEN** a shopper views the blog listing
- **THEN** the most recently published post appears first

#### Scenario: Listing is never padded

- **WHEN** fewer posts exist than would fill the listing layout
- **THEN** only the real posts are shown
- **AND** no post is repeated and no placeholder post is shown

#### Scenario: More posts than fit on one page

- **WHEN** more published posts exist than are displayed at once
- **THEN** the shopper is able to reach the remaining posts

#### Scenario: Each listed post shows its own date

- **WHEN** posts are shown in the listing
- **THEN** each shows its own publication date rather than a shared fixed date

### Requirement: The blog is public and degrades safely

Reading the blog listing or any published post MUST NOT require a shopper to be signed in.

When posts cannot be retrieved, the storefront SHALL show a clear empty or error state rather than invented posts, and the failure MUST NOT break rendering of the rest of the page.

#### Scenario: Guest reads the blog

- **WHEN** a shopper who is not signed in opens the blog listing or a published post
- **THEN** the content is shown

#### Scenario: Posts cannot be retrieved

- **WHEN** the blog posts cannot be retrieved
- **THEN** a clear empty or error state is shown
- **AND** no invented posts are displayed
- **AND** the rest of the page renders normally

#### Scenario: No posts published yet

- **WHEN** the merchant has published no posts
- **THEN** the listing shows a clear empty state
