---
layout: post
title: Bayesian Statistics
date: 2013-08-16 00:00:00
category: [fundamentals, statistics]
tags: [statistics, bayesian]

---

## Introduction

고전통계학에서는 단순히 주어진 data information (likelihood)을 최대화하는 parameter $\hat{\theta}_{\text{MLE}}$를 취한다. 하지만 베이지안 통계학에서는 데이터와 prior information을 종합하여 관심의 대상이 되는 parameter $\theta$의 불확실성을 확률 분포(posterior)로 나타내는 것을 목표로 한다.

$$p(\theta|X)=\frac{p(X|\theta)p(\theta)}{p(X)}$$

베이지안 통계학은 다음과 같은 기본적인 구조를 갖는다.

>1. Determine a prior distribution of $\theta$, $p(\theta)$
>2. Compute a posterior distribution $p(\theta\|X)$ using data $X$ and prior distribution
>3. Inference using the posterior distribution

여기서 파라미터의 prior distribution을 구하는 방법에 있어 여러 가지 문제점이 있는데, 그 중 하나는 분석자의 특성에 따라 prior distribution이 달라서 상당히 주관적이라는 것이다. 그래서 객관적인 prior distribution이 제안되었는데 그 중 하나가 noninformative prior distribution으로 Laplace에 의해 제안된 uniform distribution을 이용하는 것이다. 아무런 정보가 없는 상태에서는 모든 파라미터 값은 동일하게 취급되어야 한다는 것인데, 이는 이론적으로 문제가 있음이 밝혀졌고 (lack of invariance for transformation), 그 대안 중의 하나가 Jeffrey의 prior distribution이다.

> ##### Jeffrey's prior information
>
> $$p(\theta)=I(\theta)^{\frac{1}{2}}$$
>
> ##### Expectation of Fisher information, $I(\theta)$
>
> $$I(\theta)=-E_X \left [ \frac{\partial^2 \log{f(X|\theta)}}{\partial \theta^2} \right ]$$

일단 prior distribution이 주어지면, posterior distribution은 Bayes's rule에 의해 쉽게 구할 수 있으나 실제 데이터를 이용한 계산은 보통 어려운 작업이 아니다. 하지만 posterior distribution이 prior distribution과 동일한 분포족(distribution family)이면 posterior distribution의 계산이 쉬워지게 되는 경우가 있는데, 이러한 prior distribution을 conjugate prior라고 한다.

그리고 베이지안 통계학에서 파라미터에 대한 추론(inference)은 전적으로 posterior distribution에 의존하여 이루어진다.

## Bayesian Inference

베이지안 통계학에서 데이터가 주어졌을 때 posterior distribution을 통해 어느 모델이 가장 좋은 데이터 생성 모델인지 추론(inference)할 수 있다. 즉, 가장 좋은 데이터 모델의 parameter $\theta$를 추정할 수 있다. 미지의 파라미터 $\theta$에 대한 정보를 얻기 위해 특정 확률 변수 $X$의 값을 같은 조건 하에서 반복적으로 관측하여 표본을 추출한다. (identically independently distributed, iid) 이렇게 추출된 각각의 표본들을 모아놓은 집합을 sample space $\Omega$라고 하고, Euclidean space $\mathbb{R}^n$의 부분집합이 된다.

확률 변수 $X$의 distribution은 당연히 미지의 parameter $\theta$가 주어져야 정의된다. 따라서 $X$의 probability distribution은 $X$의 density function $f(x\|\theta)$를 이용해 나타낼 수 있다. 표본들 $\{ x_1, x_2, \dots, x_n \} (x_i \in \Omega)$가 주어졌을 때, likelihood function $L(x\|\theta)$는 다음과 같다.

$$L(x|\theta)=L(x_1, x_2, \dots, x_n|\theta)=\prod_{i=1}^n f(x_i|\theta)$$

고전통계학에서는 이 likelihood function을 이용해 parameter $\theta$에 대해 추론하고 의사 결정 과정에 이용하게 된다. 예를 들어, 이 likelihood function을 최대로 하는 parameter $\theta$를 maximum likelihood estimate (MLE)라고 부르고 $\theta$의 추정에 사용하는 것이다.

$$\hat{\theta}_{\text{MLE}}=\underset {\theta}{\text{argmax }} L(x|\theta)$$

그러나 여기에 추가적으로 표본들로부터 얻은 parameter $\theta$에 대해 활용 가능한 prior information이 있다면 더 나은 의사 결정이 가능할 것이다. 이 prior information을 parameter space $\Theta$ 위에서 정의된 probability distribution으로 나타낸 것을 prior distribution이라고 한다. 베이지안 통계학에서는 parameter에 대한 prior information과 확률 실험에 의해 얻은 데이터 정보(likelihood)를 종합한 posterior distribution을 이용해 parameter $\theta$에 대한 추론, 더 나아가 의사 결정에 이용한다.

$$\hat{\theta}_{\text{B}}=\underset {\theta}{\text{argmax }} p(\theta|X)$$

(베이지안 통계학에서는 위와 같이 posterior mode를 취하기도 하지만 posterior mean 또는 posterior median도 parameter 추정에 사용되곤 한다. Posterior는 parameter $\theta$의 distribution으로 나타나기 때문에 취할 수 있는 값은 여러가지이다.)

> ##### Reference: Statistical Inference
>1. Parameter estimation
>  - Point estimation
>  - Confidence interval estimation
>2. Hypothesis Testing

## Iterative learning (Data Update)

전통적인 모델링에서는 training set에 가장 잘 맞는 모델을 세우고, unseen data에도 적용될 수 있기를 기대한다. 즉, 새로 주어지는 데이터들에 대한 learning 과정은 수행되지 않는다.

하지만, iterative learning에서는 새로운 observation(데이터)이 발생할 때마다 기존의 prior $p^{(i)}(\theta)$와 새로이 구한 likelihood를 곱하고 normalize하여 새로운 posterior $p^{(i+1)}(\theta)$를 구해내고 기존의 prior를 대체하여 prior를 계속 새로 갱신시켜 나가는 것이다. (즉, 새로이 관측된 데이터 정보를 포함하는 새로운 prior를 취하는 것이다.)

이러한 iterative learning을 위해서는 초기상태의 prior $p^{(0)}(\theta)$가 필요한데 이를 initial belief라고 한다.

>- Given data: $X_1=\{x_{11}, x_{12}, \cdots, x_{1n}\} \sim f(X_1\|\theta)$
>- Initial belief: $\theta \sim p_0(\theta)$
>- New data: $X_2=\{x_{21}, x_{22}, \cdots, x_{2m}\}$
>- Updated prior: $\textcolor{Red}{p(\theta\|X_1)} = \frac{f(X_1\|\theta)p_0(\theta)}{p(X_1)}$
>- Likelihood of new data $X_2$: $\textcolor{Blue}{f(X_2\|\theta,X_1)}$
>- New posterior:
>$$\begin{aligned} p(\theta|X_1,X_2) &= \frac{f(X_2|\theta,X_1)p(\theta,X_1)}{p(X_1,X_2)}\\&=\frac{f(X_2|\theta,X_1)p(\theta|X_1)p(X_1)}{\sum_{\theta' \in \Theta}p({\theta}',X_1,X_2)}\\&=\frac{f(X_2|\theta,X_1)p(\theta|X_1)p(X_1)}{\sum_{\theta' \in \Theta}f(X_2|\theta',X_1)p({\theta}'|X_1)p(X_1)}\\&=\frac{\textcolor{Blue}{f(X_2|\theta,X_1)}\textcolor{Red}{p(\theta|X_1)}}{\sum_{\theta' \in \Theta}f(X_2|{\theta}',X_1)p({\theta}'|X_1)}\end{aligned}$$

### Conjugate prior

관측된 데이터의 종류 및 특성에 따라 어떤 분포든 initial belief로 사용될 수 있다. 하지만 반복적인 계산 과정을 통하면 posterior distribution은 수학적으로 매우 복잡한 분포로 빠져들 수 있다. 만약에 prior와 posterior가 같은 distribution family이라면 posterior를 구하는 계산이 훨씬 쉬워진다. (또한 posterior predictive distribution에 대한 계산도 역시 쉬워진다.) 이렇게 posterior와 같은 종류의 확률 분포를 갖는 prior distribution을 conjugate prior라고 한다.

Likelihood $p(X\|\theta)$ | Conjugate prior $p_0(\theta)$ | Posterior $p(\theta\|X)$
----------------------------- | --------------------------------- | ----------------------------
$Normal(\mu, \sigma)$         | $Normal(\mu_0, \sigma_0)$         | $Normal(\mu_1, \sigma_1)$
$Binomial(n,p)$               | $Beta(\alpha, \beta)$             | $Beta(\alpha+n, \beta+N-n)$
$Poisson(\lambda)$            | $Gamma(\alpha, \beta)$            | $Gamma(\alpha+n, \beta+1)$
$Multinomial(p_1,\dots,p_k)$  | $Dirichlet(\alpha_1,\dots,\alpha_k)$ | $Dirichlet(\alpha_1+n_1, \dots, \alpha_k+n_k)$
{:alt="Some useful conjugate priors"}

하지만, conjugate prior를 쓰면 fixed된 density structure라는 이유로 flexible하지 않다는 문제가 있다. 이에 대한 해결책은 mixture of densities의 개념을 사용하는 것이다. (자세한 내용은 생략)

## Posterior predictive distribution

기존에 주어진 데이터로 새로운 데이터의 값을 예측하는 posterior distribution이다. 주어진 데이터 $X$로 모델이 생성되었다면 posterior distribution $p(\theta\|X)$를 가지고 새로운 데이터 $Y$에 대한 prediction이 다음과 같이 가능하다.

$$\begin{aligned}p(Y|X)&=\int p(Y,\theta|X)d\theta\\&=\int p(Y|\theta,X)p(\theta|X)d\theta\\&=\int p(Y|\theta)p(\theta|X)d\theta\end{aligned}$$

위와 같이, 새로 관측가능한 데이터 $Y$에 대한 distribution을 posterior predictive distribution이라고 한다.

## Advantages of Bayesian statistics

1. 결과에 대한 해석이 전통적인 통계학보다 훨씬 쉽고 우리의 직관과 잘 부합된다.
통계학의 목표는 미지의 parameter에 대해 추론하고 그 추론의 불확실성을 계량화하는 것이다. 그런데 불확실성을 나타내는 가장 좋은 방법이 probability이며, 베이지안 통계학은 probability를 직접 이용하는 통계적 기법이다.
2. 실제로 많은 문제들에서 parameter의 prior information을 쉽게 구할 수 있다.
전통적인 통계학에서는 공통분산을 사용하는데 이는 prior information을 굉장히 단순하게 사용한 것이다. 베이지안 통계학은 더욱 효과적으로 prior information을 이용한 추론 결과를 제시할 수 있다.
3. 베이지안 기법이 전통적인 통계학의 관점에서도 좋은 추론 방법을 제공한다.
전통적인 통계학에서 사용되는 많은 통계량들은 베이지안 추정량 또는 베이지안 추정량의 극한으로 구할 수 있다.
복잡한 문제에서 parameter의 추론이 전통적인 통계학보다 쉽다.
4. 전통적인 통계학에서 많이 쓰이는 MLE(Maximum Likelihood Estimator)는 likelihood function이 복잡하거나 많은 local optima를 가지는 경우가 많아 estimation이 어려울 뿐 아니라 일반적으로 estimation 결과가 나쁠 때가 많다. 반면, 베이지안 통계학에서 개발된 MCMC기법을 사용하면 parameter의 prior distribution을 쉽게 구할 수 있을 뿐 아니라, posterior distribution을 통한 parameter 추론을 더욱 정확하게 할 수 있다.
