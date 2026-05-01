# EventyfyCraft Interview Study Sheet

## How to use this sheet
- Print **pages 1+** as the **Question Side**.
- Print the **Answer Side** on the back (duplex / flip on long edge).
- Use the same question number to match with its answer.

---

# Question Side

## Backend Questions
1. How is authentication handled in this project, and why did you choose JWT with HTTP-only cookies?
2. What is the difference between customer, admin, and employee roles in the backend?
3. How does email verification work during registration?
4. Why is password hashing needed, and why use bcrypt instead of storing plain text passwords?
5. How do you prevent unauthorized access to admin-only or employee-only routes?
6. What is the purpose of the auth middleware, and how does it extract the user from the token?
7. How does the booking creation flow work from request to database save?
8. How do you store a customer’s bookings and relate them to the customer record?
9. How are event themes managed, and why are they separated into their own model?
10. How does Razorpay payment creation work in the backend?
11. Why do you verify Razorpay signatures before saving payment records?
12. How do you handle partial payments and track already paid amounts?
13. What happens if a booking is already fully paid?
14. How does the support ticket system decide which ticket to return for a user?
15. How does the socket server authenticate users before allowing them to connect?
16. How does a chat message move from socket event to database and then to other clients?
17. What happens when an employee joins a support ticket room?
18. How does escalation work, and how are admins notified?
19. Why is Redis included in the project, and where would it be useful here?
20. How does S3 upload support work for employee work updates?
21. What is the role of the task and work update models in the employee workflow?
22. Why are some routes public while others require authentication?
23. How do you handle cookie security differently in development and production?
24. What kinds of validation are done before saving user, booking, or payment data?
25. If you had to scale this backend, what would you improve first?

## Frontend Questions
26. What is the overall frontend architecture of the app?
27. Why did you use React Router for this project?
28. How is the app separated into customer, admin, and employee sections?
29. What role does React Query play in the frontend?
30. Why is React Query a better fit here than manual fetch state in many places?
31. How do you keep frontend data fresh after mutations like booking creation or theme updates?
32. How is global state handled in the project?
33. Why do you have separate context providers for user and event data?
34. How does the frontend know which backend environment or API base URL to use?
35. What is the purpose of Mantine in this project alongside Tailwind and shadcn-style UI?
36. How do you manage reusable UI components across different dashboards?
37. How does the customer booking page work end to end?
38. How does the payment page trigger order creation and verification?
39. How are event themes displayed and selected on the user side?
40. How does the admin dashboard present booking, customer, employee, and revenue data?
41. How do you implement charts and analytics in the admin area?
42. What is the employee workflow on the frontend from pending work to completed work?
43. How do you handle protected or role-based pages in the UI?
44. How does the live chat UI connect to the socket backend?
45. How would you improve loading, error, and empty states in this app?

## System Design and Full-Stack Questions
46. Walk through the full event booking flow from login to payment confirmation.
47. Walk through the full support chat flow from ticket creation to escalation.
48. How do frontend and backend coordinate around cookies, tokens, and CORS?
49. Why is WebSocket used for support chat instead of only REST APIs?
50. How do you avoid duplicate payment records?
51. How do you ensure booking status and payment status stay consistent?
52. If the frontend refreshes, how does the app restore the user session?
53. What would happen if the payment succeeds but the backend save fails?
54. How would you make this system more reliable in production?
55. What are the biggest security risks in this architecture?
56. How would you add refresh tokens or stricter session management?
57. How would you redesign the data model if bookings and payments grow much larger?
58. How would you optimize support ticket assignment at scale?
59. How would you make the admin analytics more efficient?
60. What tests would you write first for this project?

<div style="page-break-after: always;"></div>

# Answer Side

## Backend Answers
1. Authentication is handled using JWT tokens generated during login/registration and stored in HTTP-only cookies. Each protected request verifies the token and extracts user identity and role. JWT is chosen because it is stateless and works well across REST and Socket.IO, while HTTP-only cookies lower XSS token theft risk.

2. Customers book events and pay; admins manage platform operations (bookings, themes, users, analytics); employees execute assigned work and update progress. Role-based middleware enforces this separation so each route is scoped to business responsibility.

3. During registration, the backend creates a random verification code and sends it by email. The verify endpoint checks that code, marks the user as verified, clears the code, and sends welcome communication. This prevents fake or mistyped emails from becoming active accounts.

4. Hashing protects user passwords if the database is leaked. bcrypt is used because it salts and hashes securely and is intentionally slow, making brute-force attacks expensive. Plain text storage would be a critical security failure.

5. Unauthorized access is blocked by chaining authentication middleware with role middleware. Even a valid login cannot access admin routes unless the role matches admin (same idea for employee/customer routes).

6. Auth middleware centralizes token handling: read token (cookie/header), verify JWT secret, and attach decoded payload to req.user. This avoids repeating token parsing logic in every route and reduces security mistakes.

7. Booking flow: authenticated customer submits event payload, backend resolves customer record from user id, creates booking document, pushes booking id into customer.events, then optionally sends booking confirmation email.

8. A customer document keeps an array of referenced booking ids. The booking collection stores booking details. This normalized relationship supports one-to-many history without duplicating large booking objects.

9. Event themes are in a dedicated model so admins can CRUD a reusable catalog independently from bookings. This keeps booking records stable while allowing theme management to evolve over time.

10. Razorpay order creation validates booking existence, payment amount, and pending balance, then creates a Razorpay order with amount in paise and booking metadata in notes.

11. Signature verification ensures payment callbacks are genuine. The backend recomputes HMAC (`order_id|payment_id`) using secret key and compares it with Razorpay signature before marking payment success.

12. Partial payment is handled by aggregating successful historical payments for a booking and computing pending amount = totalAmount - alreadyPaid. New payments are allowed only within pending amount.

13. If already fully paid, the backend rejects the request and does not create a new order/payment entry. This avoids accidental double charging.

14. Ticket selection is role-aware: customer gets active/latest own ticket; employee gets assigned/open ticket (or unassigned fallback); admin can open latest operational ticket context. This prevents chat dead-ends.

15. Socket authentication uses `io.use()` middleware. It reads token from handshake auth or cookie header, verifies JWT, and stores decoded user on `socket.user`; invalid tokens reject connection.

16. On `send_message`, backend validates socket context, persists message in MongoDB, then emits `receive_message` to ticket room participants, ensuring both real-time delivery and durable history.

17. When employee joins ticket room, backend may auto-assign that employee if ticket is unassigned and can update status from pending to active.

18. Escalation updates ticket status to escalated and pushes admin notification events to connected admin sockets so issues surface immediately.

19. Redis can accelerate frequently-read data (dashboards, counters), support rate limiting, ephemeral session-like state, and future queue/pub-sub patterns for scale.

20. S3 support allows employees to upload evidence files through pre-signed URLs or backend upload path. Database stores file metadata/URL while S3 handles durable object storage.

21. Task model tracks assigned work lifecycle; work update model tracks incremental progress/evidence for those tasks. Together they provide accountability and operational traceability.

22. Public routes are limited to onboarding/auth entry points; sensitive routes require auth because they expose personal data, booking details, payments, or admin operations.

23. Cookie flags vary by environment: production uses stricter secure/sameSite settings; development relaxes settings for local frontend-backend integration while keeping HTTP-only.

24. Validation includes required field checks, existence checks for referenced records, amount parsing/sanity checks, duplicate email prevention, role checks, and payment boundary checks.

25. First scaling improvements: stronger schema validation, indexing hot queries, caching analytics with Redis, idempotency for payments, background jobs for emails/uploads, and structured observability.

## Frontend Answers
26. The frontend is a Vite + React + TypeScript SPA organized by role domains (customer/admin/employee), with shared UI components and centralized API utilities.

27. React Router enables clean client-side navigation between landing pages and role dashboards with predictable URL structure and deep-link support.

28. Routes are grouped by role prefixes and dashboard modules, matching backend role boundaries and minimizing cross-role UI leakage.

29. React Query manages server state lifecycle: fetch, cache, revalidate, mutation, stale control, and error/loading states.

30. It is better than manual fetch state because this app has many data-heavy pages; React Query removes repetitive boilerplate and improves cache consistency.

31. After successful mutations, related queries are invalidated/refetched so tables/charts/bookings reflect latest backend state immediately.

32. Global client state is managed with context providers for cross-page data that is not purely server cache.

33. Separate providers (user/event) avoid over-coupled state, keep update boundaries smaller, and improve maintainability.

34. Backend URL is centralized in utility/config so environments (local/staging/prod) can switch safely without changing every component.

35. Mantine gives robust component primitives; Tailwind/shadcn-style utilities provide flexible custom styling and layout speed.

36. Reusable shared components (sidebars, modals, profile editors, task components, tables/charts wrappers) reduce duplication across dashboards.

37. Customer booking page loads themes/history, captures event details in form, submits booking mutation, and refreshes booking-related queries.

38. Payment page calls create-order API, launches Razorpay checkout, then calls verify API with returned ids/signature to finalize status.

39. User-side themes are fetched from API and rendered as selectable options during booking to standardize event styling choices.

40. Admin dashboard combines KPIs, tables, and charts sourced from booking/customer/employee endpoints for operational visibility.

41. Analytics charts are implemented with chart components fed by query data transformed into series/categories for status, type, and revenue trends.

42. Employee flow moves work through pending -> in-progress -> completed pages, with updates and evidence uploads tied to task progress.

43. Role-based handling is done through route grouping and auth-aware navigation/state checks; unauthorized users should be redirected appropriately.

44. Live chat UI opens a socket connection with auth token, joins ticket room, listens for incoming events, and emits outgoing messages in real time.

45. Improve UX by standardizing skeleton loaders, retry actions, actionable empty states, and consistent API error surface across all pages.

## System Design and Full-Stack Answers
46. Booking flow: login -> auth cookie set -> select theme + create booking -> backend saves booking + links customer -> create Razorpay order -> user pays -> verify signature -> payment saved -> booking payment status updated.

47. Chat flow: open support-ticket endpoint -> get/create role-appropriate ticket -> socket connect + auth -> join ticket room -> exchange messages (persist + broadcast) -> escalate when needed -> admins notified instantly.

48. Coordination relies on CORS allowlist + credentialed requests so browser includes HTTP-only auth cookies; backend validates token on each protected request/socket handshake.

49. WebSocket is used because support chat needs low-latency bidirectional events (messages, escalation alerts) that polling-based REST cannot deliver as efficiently.

50. Duplicate payments are reduced via pending-amount checks, signature validation, and should be further strengthened with idempotency keys/unique constraints on payment ids.

51. Consistency is preserved by deriving booking payment status from accumulated successful payments and updating booking state after verified transaction writes.

52. On refresh, browser still sends auth cookie; frontend refetches current user/session data from protected endpoints and reconstructs UI state.

53. If gateway succeeds but backend write fails, system enters reconciliation risk. Production mitigation: webhook reconciliation, idempotent retries, audit logs, and admin recovery tooling.

54. Reliability upgrades: retries for external services, queue-based async jobs, graceful degradation, health checks, centralized logging, tracing, and alerting.

55. Top security risks: weak authorization checks, insecure cookie/CORS config, insufficient input/file validation, token misuse in sockets, and payment forgery attempts.

56. Add short-lived access token + rotating refresh token with revocation store, device/session tracking, and forced logout on compromise.

57. For growth, add targeted indexes/partitioning strategy, pre-aggregated analytics tables/views, archive old records, and separate hot transactional reads from reporting workloads.

58. Scale ticket assignment with queue + routing policy (skill, load, priority, SLA) and heartbeat-based agent availability.

59. Make analytics efficient with cached aggregates (Redis/materialized views), scheduled precompute jobs, and lean API payloads.

60. First tests: auth/role guard tests, booking creation validations, payment signature verification + overpayment cases, ticket/chat lifecycle tests, and critical frontend integration tests for booking/payment flows.
