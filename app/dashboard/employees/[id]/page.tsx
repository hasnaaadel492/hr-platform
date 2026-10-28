type Employee = {
	name: string;
	title: string;
	department: string;
	email: string;
	phone: string;
	location: string;
	manager: string;
	status: "Active" | "On leave";
	startDate: string;
};

const employees: Record<string, Employee> = {
	"1": {
		name: "Alex Morgan",
		title: "Senior Product Designer",
		department: "Product Design",
		email: "alex.morgan@company.com",
		phone: "+1 (415) 555-0138",
		location: "San Francisco, CA",
		manager: "Jordan Lee",
		status: "Active",
		startDate: "March 14, 2022",
	},
	"2": {
		name: "Sam Rivera",
		title: "People Operations Specialist",
		department: "People & Culture",
		email: "sam.rivera@company.com",
		phone: "+1 (415) 555-0172",
		location: "Austin, TX",
		manager: "Taylor Kim",
		status: "Active",
		startDate: "August 8, 2023",
	},
};

const activity = [
	{ title: "Profile updated", detail: "Contact information was updated", date: "May 18, 2025" },
	{ title: "Annual review completed", detail: "Performance review for 2024–2025", date: "April 30, 2025" },
	{ title: "Time off approved", detail: "Paid time off · 3 days", date: "April 12, 2025" },
];

function initials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export default function EmployeePage({ params }: { params: { id: string } }) {
	const employee = employees[params.id] ?? {
		name: "Employee profile",
		title: "Team member",
		department: "—",
		email: "—",
		phone: "—",
		location: "—",
		manager: "—",
		status: "Active" as const,
		startDate: "—",
	};

	const details = [
		["Work email", employee.email],
		["Phone number", employee.phone],
		["Location", employee.location],
		["Manager", employee.manager],
		["Start date", employee.startDate],
	];

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
			<div className="mx-auto max-w-6xl">
				<nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
					<a href="/dashboard" className="transition hover:text-slate-900">Dashboard</a>
					<span aria-hidden="true">/</span>
					<a href="/dashboard/employees" className="transition hover:text-slate-900">Employees</a>
					<span aria-hidden="true">/</span>
					<span className="font-medium text-slate-700">Profile</span>
				</nav>

				<header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
					<div className="flex items-center gap-5">
						<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl font-semibold text-indigo-700">
							{initials(employee.name)}
						</div>
						<div>
							<div className="mb-1 flex flex-wrap items-center gap-3">
								<h1 className="text-2xl font-semibold tracking-tight">{employee.name}</h1>
								<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
									{employee.status}
								</span>
							</div>
							<p className="text-sm text-slate-600">{employee.title}</p>
							<p className="mt-1 text-sm text-slate-500">{employee.department} <span className="px-1">·</span> Employee ID {params.id}</p>
						</div>
					</div>
					<div className="flex gap-3">
						<button type="button" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
							Message
						</button>
						<button type="button" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">
							Edit profile
						</button>
					</div>
				</header>

				<div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
					<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="details-heading">
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h2 id="details-heading" className="text-lg font-semibold">Personal information</h2>
								<p className="mt-1 text-sm text-slate-500">Employee contact and work details</p>
							</div>
							<span className="text-xs font-medium uppercase tracking-wide text-slate-400">Profile</span>
						</div>
						<dl className="grid gap-x-8 sm:grid-cols-2">
							{details.map(([label, value]) => (
								<div key={label} className="border-t border-slate-100 py-4">
									<dt className="text-sm text-slate-500">{label}</dt>
									<dd className="mt-1.5 break-words text-sm font-medium text-slate-800">{value}</dd>
								</div>
							))}
						</dl>
					</section>

					<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="activity-heading">
						<div className="mb-6">
							<h2 id="activity-heading" className="text-lg font-semibold">Recent activity</h2>
							<p className="mt-1 text-sm text-slate-500">The latest updates to this profile</p>
						</div>
						<ol className="space-y-6">
							{activity.map((item, index) => (
								<li key={item.title} className="relative flex gap-4">
									{index < activity.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-slate-200" aria-hidden="true" />}
									<span className="relative mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-indigo-500 bg-white" aria-hidden="true" />
									<div className="min-w-0 pb-1">
										<p className="text-sm font-medium text-slate-800">{item.title}</p>
										<p className="mt-1 text-sm text-slate-500">{item.detail}</p>
										<time className="mt-2 block text-xs text-slate-400">{item.date}</time>
									</div>
								</li>
							))}
						</ol>
					</section>

					<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 lg:col-span-2" aria-labelledby="employment-heading">
						<div className="mb-5">
							<h2 id="employment-heading" className="text-lg font-semibold">Employment</h2>
							<p className="mt-1 text-sm text-slate-500">Current role and organizational placement</p>
						</div>
						<div className="grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
							<div><p className="text-sm text-slate-500">Position</p><p className="mt-1 font-medium">{employee.title}</p></div>
							<div><p className="text-sm text-slate-500">Department</p><p className="mt-1 font-medium">{employee.department}</p></div>
							<div><p className="text-sm text-slate-500">Employment status</p><p className="mt-1 font-medium">Full-time · {employee.status}</p></div>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
