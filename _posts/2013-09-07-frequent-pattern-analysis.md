---
layout: post
title: Frequent Pattern Analysis
date: 2013-09-07 23:08:43
category: algorithm
tags: [apriori]

---

## Frequent Pattern

A pattern that occurs frequently in a data set.

## Association Rules

Find all the rules $X \rightarrow Y$ with minimum support (MinSup) and confidence.

$$X \rightarrow Y \text{ (support, confidence)}$$

- $\text{Support}(s)$: probability that a transaction contains both (or more) of two itemsets ($X \cup Y$)
- $\text{Confidence}(c)$: conditional probability that a transaction having an itemset $X$ also contains another itemset $Y$

## Apriori

Apriori is a classic algorithm for **frequent itemset mining** and **association rule learning** over transactional databases. It proceeds by identifying the frequent individual items in the database and extending them to larger and larger item sets as long as those item sets appear sufficiently often in the database. The frequent item sets determined by Apriori can be used to determine association rules which highlight general trends in the database: this has applications in domains such as market basket analysis.

If there is any infrequent itemset, its superset should not be generated/tested.

1. Initially, scan DB once to get frequent $1$-itemset
2. Generate length ($k+1$) candidate itemsets from length $k$ frequent itemsets - Self Joining
3. Test the candidates against DB - Pruning
4. Terminate when no frequent or candidate set can be generated

![Apriori]({{ site.baseurl }}/assets/img/ce521bb359d66bafcd318997e70326b9a0adb521eb20195ba762a6ba5cb0e9d6.png){:width="544px"}

---

## References

1. "Data Mining: Concepts and Techniques" - Jiawei Han and Micheline Kamber
