import random
import re
from collections import Counter

# ---------------------------------
# LOAD HISTORICAL DRAWS
# ---------------------------------

def load_historical_draws(filename):
    draws = []
    with open(filename, "r") as f:
        for line in f:
            nums = list(map(int, re.findall(r"\d+", line)))
            main = set(nums[3:8])
            lucky = nums[8]
            draws.append((main, lucky))
    return draws

historical_draws = load_historical_draws("data.txt")

# ---------------------------------
# FREQUENCIES (YOUR DATA)
# ---------------------------------

main_freq = {
    30:246, 28:239, 8:235, 1:234, 9:234, 3:232, 15:230, 31:230,
    46:228, 5:227, 4:227, 34:227, 24:225, 39:225, 17:224, 7:224,
    40:223, 2:221, 37:219, 27:217, 47:217, 12:217, 38:216,
    16:216, 19:215, 21:215, 43:214, 48:214, 25:213, 29:212,
    33:212, 44:212, 10:211, 22:211, 45:210, 11:209, 42:208,
    36:205, 32:205, 26:203, 6:202, 18:202, 20:199, 23:199,
    13:196, 14:194, 41:194, 35:192
}

lucky_freq = {
    15:136, 11:131, 9:130, 10:123, 6:122, 1:121, 2:121,
    18:118, 8:118, 17:111, 3:111, 4:108, 12:107,
    14:105, 16:104, 7:104, 13:104, 5:102
}

# ---------------------------------
# SAMPLERS
# ---------------------------------

def weighted_sample_no_replace(freq_dict, k):
    numbers = list(freq_dict.keys())
    weights = list(freq_dict.values())
    chosen = []

    for _ in range(k):
        pick = random.choices(numbers, weights=weights, k=1)[0]
        i = numbers.index(pick)
        chosen.append(pick)
        numbers.pop(i)
        weights.pop(i)

    return sorted(chosen)

def pure_random_ticket():
    main = sorted(random.sample(range(1, 49), 5))
    lucky = random.randint(1, 18)
    return main, lucky

def algorithmic_ticket():
    main = weighted_sample_no_replace(main_freq, 5)
    lucky = weighted_sample_no_replace(lucky_freq, 1)[0]
    return main, lucky

# ---------------------------------
# EVALUATION
# ---------------------------------

def evaluate(ticket, historical_draws):
    main, lucky = ticket
    results = Counter()

    for hist_main, hist_lucky in historical_draws:
        matches = len(set(main) & hist_main)
        lucky_match = (lucky == hist_lucky)

        results[matches] += 1
        if lucky_match:
            results["lucky"] += 1

    return results

def run_simulation(generator, n=50000):
    agg = Counter()
    for _ in range(n):
        ticket = generator()
        res = evaluate(ticket, historical_draws)
        agg.update(res)
    return agg

# ---------------------------------
# RUN BOTH
# ---------------------------------

algo_results = run_simulation(algorithmic_ticket)
random_results = run_simulation(pure_random_ticket)

# ---------------------------------
# REPORT
# ---------------------------------

print("\nAverage matches per 10,000 tickets:\n")

for k in range(6):
    print(f"{k} matches:")
    print(f"  Algorithmic: {algo_results[k]}")
    print(f"  Random:      {random_results[k]}")

print("\nLucky Ball Matches:")
print(f"  Algorithmic: {algo_results['lucky']}")
print(f"  Random:      {random_results['lucky']}")
