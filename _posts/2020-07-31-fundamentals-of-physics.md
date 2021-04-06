---
category: [fundamentals, physics]
date: 2020-08-31 09:52:18
layout: post
tags: [physics, dynamics]
title: Fundamentals of Physics
---

## 일반물리학

한양대학교 물리학과 [신상진](http://hepth.hanyang.ac.kr/~sjs/index.html) 교수

---

## CHAPTER 4. 뉴턴의 세 법칙

### 뉴턴 제1법칙: 관성

외부의 힘 $F_{\text{ext}} = 0$이면 운동의 상태를 유지

> ##### 관성계
>
> 관성의 법칙이 성립하는 계.
>
> 현실에서 관성계를 찾기란 거의 불가능하다. 왜냐하면 지구도 자전하고, 우리 은하도 자전하고 있기 때문이다. 관성계는 우주 전체에 대해서 철학적으로 이야기할 때나 쓸 수 있을 뿐 현실에서는 하나도 도움이 안된다. 관성계는 개념적인 체계, 수학적인 액션의 세상이다.

### 뉴턴 제2법칙: 가속도

$$a=\frac{1}{m}F$$

- 관성질량 $m$: 힘 $F$에 맞서 운동의 상태 변화를 거부하는 정도
- 가속도 $\vec{a}$와 힘 $\vec{F}$는 벡터 물리량

$$\begin{aligned}\vec{a}&=\frac{1}{m}\vec{F}\\(a_x,a_y)&=\frac{1}{m}(F_x,F_y)\end{aligned}$$

2차원 공간에서 질량이 $m$인 물체를 던지는 상황을 가정:

$$\begin{aligned}F_x=0 &\Rightarrow a_x=0\\&\Rightarrow v_x(t)=v_x(0)\\&\Rightarrow x-x_0=v_x(0)\cdot t\\&\Rightarrow x = v_x(0)\cdot t\end{aligned}$$

$$\begin{aligned}F_y=ma &\Rightarrow a_y=\frac{1}{m}(-m^*g)=-g\end{aligned}$$

- 가속도는 물체의 질량과 관계 없이 항상 일정 (constant)
- 관성질량 $m$은 중력질량 $m^*$ 동일하거나 비례하다.
	- 관성질량 $m$과 중력질량 $m^*$이 같을 이유가 없는데 동일하다.
	- **등가원리 (일반상대성이론)**

$$\begin{aligned}&\Rightarrow a_y=-g\\&\Rightarrow v_y(t)=v_y(0)\cdot t-\frac{1}{2}gt^2\end{aligned}$$

$$\begin{aligned}v_x(0)&=v(0)\cos{\theta}\\v_y(0)&=v(0)\sin{\theta}\end{aligned}$$

### 뉴턴 제3법칙: 작용과 반작용

1. 두 개의 힘은 서로 다른 물체에 작용:

	$$\vec{F}_{a\rightarrow b}=-\vec{F}_{b\rightarrow a}$$

1. 운동량의 보존

	$$p=mv$$

> ##### 운동량 $p$를 $mv$로 정의하는 이유
>
> 뉴턴 제2법칙을 다시 쓰면 다음과 같이 쓸 수 있는데:
>
> $$F=ma=m\cdot\frac{dv}{dt}=\frac{d}{dt}(mv)$$
>
> $F=0$일때 $mv$는 시간에 따라 변화가 없는 어떤 일정한 값이어야 하는데, 일정한 값으로 존재할 수 있는 $mv$를 운동량(momentum) $p$라고 정하기로 함.
>
> 어떤 물체에 대해서 $F=0$이면 운동량 $p$는 일정하다.

두 물체가 서로에 대해 작용하는 경우는 더 복잡하다:

$$\begin{aligned}\frac{d}{dt}(m\vec{v}_a)&=\vec{F}_{b\rightarrow a}\\\frac{d}{dt}(m\vec{v}_b)&=\vec{F}_{a\rightarrow b} =-\vec{F}_{b\rightarrow a}\\&\Downarrow \text{sum}\\\frac{d}{dt}(m\vec{v}_a)+\frac{d}{dt}(m\vec{v}_b)&={F}_{b\rightarrow a}+{F}_{a\rightarrow b}\\\frac{d}{dt}(\vec{p}_a + \vec{p}_b)&=0\end{aligned}$$

- 총 운동량이 보존됨을 알 수 있다.
- Momentum 보존법칙이 성립한다는 것은 **전 체계의 무게중심이 등속직선운동**한다는 의미이다.

---

## CHAPTER 5. 뉴턴 제2법칙의 응용과 역학적 에너지 보존 법칙

### 1차원에서의 일(에너지)

$$\begin{aligned}mx'' &= ma = F(x)\\x'mx''&=F(x)x'\\\frac{d}{dt}\left(\frac{1}{2}mv^2\right)&=F(x)x'\\\int_0^t\frac{d}{\cancel{dt}}\left(\frac{1}{2}mv^2\right)\cancel{dt}&=\int_0^tF(x)x'dt\\\frac{1}{2}mv^2-\frac{1}{2}mv_0^2&=\int_0^t\frac{dx}{dt}F(x)dt=\int_{x_0}^{x_t}F(x)dx\\&=\int_{x^\ast}^{x_t}F(x)dx-\int_{x^\ast}^{x_0}F(x)dx\\&=-V(x_t)+V(x_0)\\&\text{where }V(x)=-\int_{x_\ast}^{x}F(x)dx \text{, and }x_\ast \text{ is a referential point.}\\&\Downarrow\\\frac{1}{2}mv^2+V(x_t)&=\frac{1}{2}mv_0^2+V(x_0)=E\end{aligned}$$

여기서 좌변의 $\frac{1}{2}mv^2$를 kinetic energy, $V(x_t)$를 potential energy로 부를 수 있게 되었다. 즉, potential energy

$$V(x)=-\int F(x)dx$$

는 힘을 적분해서 나온 값으로, potential에 상수를 더하거나 빼도 **미분하면 동일한 값**이 나오기 때문에 referential point $x_\ast$가 어떤 값이냐는 중요하지 않다. (Referential point가 변하는 것은 potential에 상수가 더해지고 빼지는 효과)

중요한 것은 potential을 position $x$에 관해서 미분해서 음수 값을 갖는 힘이 나오기만 하면 된다.

뉴턴 제2법칙을 한번 적분한 형태로 표현하면:

$$\frac{1}{2}mv_t^2 -\frac{1}{2}mv_0^2=\int_{x_0}^{x_t} F(x)dx$$

- Kinetic energy $(\frac{1}{2}mv^2)$의 차이(좌변)는 **일**(우변)을 의미
- 힘 $F$를 거리 $\Delta x(= x_t - x_0)$에 관해 적분한 것이 일이므로 일정한 힘을 거리 $\Delta x$만큼 가해 물체를 이동시킨 일 $W$은 다음과 같이 표현할 수 있다:

$$W=F\Delta x$$

힘의 방향과 물체의 이동 방향이 $\theta$만큼 차이가 난다면:

$$\begin{aligned}W&=F\cos{\theta}\Delta x\\&=\vec{F}\cdot\Delta\vec{x}\end{aligned}$$

> ##### Inner Product
>
> $$\vec{A}\cdot\vec{B}\overset{\text{def}}{=}|\vec{A}|\cos{\theta}\cdot|\vec{B}|$$

만약 위치에 따라 힘의 크기가 달라진다면 구간별로 정해서 다 더하면 된다:

$$W=\int_c\vec{F_x}\cdot d\vec{x}$$

- $c$: 여러 경로가 가능한 경우 어느 한 경로를 지정하기 위해 필요한 변수
	- 일 $W$는 final point에서만의 함수가 아니기 때문에

### 3차원에서의 일

$$\begin{aligned}m\vec{X}''&=\vec{F}\\m\vec{X}''\cdot\vec{X}'&=\vec{F}\cdot\vec{X}'\\\int m\vec{X}''\cdot\vec{X}'dt&=\int\vec{F}\cdot\vec{X}'dt\\\int\frac{d}{dt}\left(\frac{1}{2}m\vec{X}'\cdot\vec{X}'\right)dt&=\int\vec{F}\cdot\frac{d\vec{X}}{\cancel{dt}}\cdot\cancel{dt}=\int\vec{F}\cdot d\vec{X}\\&=\int\vec{F_x}d\vec{x}+\int\vec{F_y}d\vec{y}+\int\vec{F_z}d\vec{z}\end{aligned}$$

- 좌변: kinetic energy $\left(\frac{1}{2}m\vec{X}^\prime\cdot\vec{X}^\prime\right)$의 처음과 나중의 차이
- 우변: 각 차원별로 수행한 일의 합

> ##### 참고
>
> $$\begin{aligned}\vec{X}&=(\vec{x},\vec{y},\vec{z})\\&\Downarrow\\\vec{X}'&=(\vec{x}',\vec{y}',\vec{z}')\\\vec{X}''&=(\vec{x}'',\vec{y}'',\vec{z}'')\\&\Downarrow\\m\vec{X}''\cdot\vec{X}'&=m\left(\vec{x}''\vec{x}'+\vec{y}''\vec{y}'+\vec{z}''\vec{z}'\right)\\&=\frac{d}{dt}\left[\frac{1}{2}m\left(\vec{x}'^{2}+\vec{y}'^{2}+\vec{z}'^{2}\right)\right]\\&=\frac{d}{dt}\left(\frac{1}{2}m\vec{X}'\cdot\vec{X}'\right)\end{aligned}$$

$n$차원에서의 일 $W$:

$$W=\int_c\vec{F}\cdot d\vec{X}$$

### 3차원에서의 에너지 보존

일반적인 경우에는 에너지 보존이 성립하지 않는다.
- 경로 $c$: $\vec{X}_\ast \overset{c}{\rightarrow} \vec{X}$

> ##### 벡터장 $\vec{F}$
> 벡터장이란 **공간의 한 포인트 포인트마다 벡터가 정의되어 있는 것**으로, 벡터장에 대해서만 잘 이해하면 중력장, 전장 등 모든 장에 대해 이해할 수 있음
>
> ![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Irrotationalfield.svg/300px-Irrotationalfield.svg.png)

그럼 3차원에서 역학적 에너지 보존 법칙은 언제 성립하는가?

결론부터 말하면 **$\vec{F}$가 보존장이면 역학적 에너지 보존이 성립**한다.

> ##### 에너지 보존장 (Conservative Field)
> 어느 두 지점 사이를 움직인 일의 양 $W$
>
> $$W=\int_c\vec{F}\cdot d\vec{X}$$
>
> 가 **경로 $c$에 무관하게 일정할 때 $\vec{F}$는 보존장**이다.
>
> 이때, 포텐셜 에너지 $V$는 다음과 같이 정의할 수 있다:
>
> $$V(\vec{X})\overset{\text{def}}{=}-\int\vec{F}d\vec{X}$$
>
> - 경로 $c$가 생략됨 $\rightarrow$ 경로 의존성이 없음

에너지 보존장에서 임의의 위치 $X_\ast$와 두 위치 $A$, $B$가 있을 때 각 포텐셜 에너지는 다음과 같이 쓸 수 있고:

$$\begin{aligned}V(X_A)&=-\int_{X_\ast}^{X_A}\vec{F}d\vec{X}\\V(X_B)&=-\int_{X_\ast}^{X_B}\vec{F}d\vec{X}\end{aligned}$$

위치 $A$에서 위치 $B$로 움직인 일의 양은 $X_\ast$에서 $B$로 움직인 일의 양 $-V(X_B)$에서, $X_\ast$에서 $A$로 움직인 일의 양 $-V(X_A)$을 뺀 값으로 결정할 수 있다:

$$\begin{aligned}\frac{1}{2}m\vec{v_B}^2-\frac{1}{2}m\vec{v_A}^2&=-V(X_B)-(-V(X_A))\\\frac{1}{2}m\vec{v_B}+V(X_B)&=\frac{1}{2}m\vec{v_A}^2+V(X_A)\end{aligned}$$

따라서 임의의 위치에서의 역학적 에너지 $E$:

$$E=\frac{1}{2}m\vec{v}^2+V(X)$$

값은 항상 일정하다.

수학적으로 보면 보존법칙이 성립할 가능성은 거의 없지만 물리에서는 대부분 보존법칙이 성립한다.

예를 들면, 중력장은 보존장이다:

$$\begin{aligned}W&=mg\sin{\theta}\cdot L\\&=mg\cdot h &&(\because L\sin{\theta} = h)\end{aligned}$$

$\theta$만큼 기울어진 비탈길을 따라 이동하는 일의 양은 수직으로 이동하는 일의 양과 같다. 수평 이동에서 일의 양은 $0$이다.

---

## CHAPTER 7. 운동량과 충돌

> ##### 뉴턴 제2법칙
>
> $$\begin{aligned}m\frac{d\vec{v}}{dt}&=\frac{d}{dt}(m\vec{v})=\frac{d}{dt}\vec{p}=\vec{F} && (\because\vec{p}=m\vec{v})\end{aligned}$$
>
> ##### 뉴턴 제3법칙
>
> External force가 없을 때, 한 계 전체에 대한 운동량 보존 방정식:
>
> $$\sum_i\frac{d}{dt}(m\vec{v_i})=\sum_i\vec{F_i}=0$$
>
> 만약 $\sum_i\vec{F_i}=0$이면, total momentum은 보존된다:
> $$\sum_i\vec{p_i} = 0$$

### 충격량 $\vec{J}$

충격량은 힘의 시간 적분이다:

$$\begin{aligned}\vec{J}&=\int F\cdot dt\\&=\int\frac{d\vec{p}}{\cancel{dt}}\cdot \cancel{dt}=\Delta\vec{p}\end{aligned}$$

- Momentum의 변화량이다.

### 1차원 충돌

질량이 각각 $m_1$, $m_2$인 두 물체의 탄성충돌은 에너지가 보존된다:

$$\begin{aligned}m_1v_1+m_2v_2&=m_1{v'_1}+m_2{v'_2}&&\cdots(1)\\\frac{1}{2}m_1v_1^2+\frac{1}{2}m_2v_2^2&=\frac{1}{2}m_1{v'_1}^2+\frac{1}{2}m_2{v_2'}^2\\&\Downarrow\\m_1(v_1-v'_1)&=m_2(v'_2-v_2)\\m_1(v_1^2-{v_1'}^2)&=m_2({v_2'}^2-v_2^2)\\&\Downarrow\\\cancel{m_1(v_1-{v_1'})}(v_1+{v_1'})&=\cancel{m_2({v_2'}-v_2)}({v_2'}+v_2)\\v_1+{v_1'}&=v_2+{v_2'}&&\cdots(2)\\v_1-v_2&=-(v'_1-v'_2)\end{aligned}$$

$(1)$과 $(2)$를 연립하면 $v^\prime_1$과 $v^\prime_2$을 구할 수 있다:

$$\begin{aligned}m_1v_1+m_2v_2&=m_1{v'_1}+m_2{v'_2} &&\cdots (1)\\m_2(v_1+{v_1'})&=m_2(v_2+{v_2'})&&\cdots (2)\\&\Downarrow&&\cdots (1)-(2)\\(m_1-m_2)v_1+m_2v_2-m_2v'_1&=m_1v'_1-m_2v_2\\(m_1-m_2)v_1+2m_2v_2&=(m_1+m_2)v'_1\end{aligned}$$

$$\begin{aligned}\Rightarrow v'_1&=\frac{m_1-m_2}{m_1+m_2}v_1+\frac{2m_2}{m_1+m_2}v_2\\v'_2&=\frac{m_2-m_1}{m_2+m_1}v_2+\frac{2m_1}{m_2+m_1}v_1\end{aligned}$$

- $m_1=m_2$인 경우:
	$$\begin{aligned}v'_1=v_2, &&v'_2=v_1\end{aligned}$$
- $v_2=0$인 경우:
	$$\begin{aligned}v'_1=\frac{m_1-m_2}{m_1+m_2}v_1,&&v'_2=\frac{2m_1}{m_2+m_1}v_1\end{aligned}$$
- $m_1\ll m_2$인 경우:
	$$\begin{aligned}v'_1&=\frac{\cancel{m_1}-m_2}{\cancel{m_1}+m_2}v_1+\frac{2m_2}{\cancel{m_1}+m_2}v_2=2v_2-v_1\end{aligned}$$
	- **Swing-Shot Effect**
		- 행성의 중력이 행성을 향해 날아온 물체의 운동방향만 바꾸고, 충돌과 동일한 효과를 발생시켜 물체는 **행성의 공전속도의 두배만큼 가속**을 얻는다.
		- **충돌**은 멀리 떨어진 두 물체가 만나 어떠한 상호작용을 한 이후 다시 떨어져 나가는 현상을 말한다. 예를 들어, 충돌이 발생해도 원자와 원자는 서로 contact하지 않고 서로 밀어내는 척력으로 인해 다시 멀어진다.

### 2차원, 3차원 충돌

$$\begin{aligned}m_1\vec{v_1}+m_2\vec{v_2}&=m_1{\vec{v'_1}}+m_2{\vec{v'_2}}&&\cdots(1)\\\frac{1}{2}m_1\vec{v_1}^2+\frac{1}{2}m_2\vec{v_2}^2&=\frac{1}{2}m_1{\vec{v'_1}}^2+\frac{1}{2}m_2{\vec{v'_2}}^2&&\cdots(2)\end{aligned}$$

2차원의 경우 식$(1)$은 2개가 나오고 식$(2)$은 1개가 나오는데, 미지수는 $\vec{v_1}$에 $x$, $y$ component가 하나씩, $\vec{v_2}$에 $x$, $y$ component가 하나씩 해서 총 4개가 있다. 미지수의 수보다 식의 수가 적기 때문에 임의의 두 물체가 충돌할 때 **보존량만 가지고는** 어디로 튕겨나갈지 예측할 수 없다.

3차원의 경우 식$(1)$은 3개가 나오고 식$(2)$는 1개 나와서 총 4개의 식이 나오지만 미지수는 6개라 더 예측할 수 없다.

만약 $m_1=m_2=m$ 이고, $\vec{v_2}=0$ 인경우:

$$\begin{aligned}m\vec{v_1}+\cancel{m\vec{v_2}}&=m{\vec{v'_1}}+m{\vec{v'_2}}\\\frac{1}{2}m\vec{v_1}^2+\cancel{\frac{1}{2}m\vec{v_2}^2}&=\frac{1}{2}m{\vec{v'_1}}^2+\frac{1}{2}m{\vec{v'_2}}^2\\&\Downarrow\\\vec{v_1}&=\vec{v'_1}+\vec{v'_2}\\\vec{v_1}^2&={\vec{v'_1}}^2+{\vec{v'_2}}^2\\&\Downarrow\\\vec{v_1}^2&={\vec{v'_1}}^2+2\vec{v'_1}\cdot\vec{v'_2}+{\vec{v'_2}}^2&&(\because \vec{v_1}^2=\vec{v_1}\cdot\vec{v_1})\\\vec{v_1}^2&={\vec{v'_1}}^2+{\vec{v'_2}}^2\\&\Downarrow\\2\vec{v'_1}\cdot\vec{v'_2}&\rightarrow0\end{aligned}$$

충돌 후 둘 중 하나의 속도가 $0$이거나, 그게 아니라면 이동 방향이 수직$(90\degree)$이 된다.

---

## CHAPTER 8. 입자계

$N$-body의 경우:

$$\begin{aligned}\frac{d\vec{p_i}}{dt}&=\vec{F_i}^\text{ext}+\vec{F_{1\rightarrow i}}+\vec{F_{2\rightarrow i}}+\cdots+\vec{F_{N\rightarrow i}}\\&\Downarrow(\vec{F}_{a\rightarrow b}+\vec{F}_{b\rightarrow a}=0)\\\sum_i\frac{d\vec{p_i}}{dt}&=\sum_i\left(\vec{F_i}^\text{ext}+\cancel{\vec{F}_{1\rightarrow i}}+\cancel{\vec{F}_{2\rightarrow i}}+\cdots+\cancel{\vec{F}_{N\rightarrow i}}\right)\\&\Downarrow\\\frac{d\vec{P}}{dt}&=\sum_i\vec{F_i}^\text{ext}=\vec{F}^\text{ext}\end{aligned}$$

외력이 없을 경우$(\vec{F}_\text{total}^\text{ext}=0)$, total momentum이 보존된다.

$$\begin{aligned}\vec{P}&=\sum_i^N\vec{p_i}=m_1\vec{v_1}+m_2\vec{v_2}+\cdots+m_N\vec{v_N}=M\vec{V}\\M&=\sum_im_i\\\vec{V}&=\frac{\sum_im_i\vec{v_i}}{\sum_im_i}=\frac{d}{dt}\left(\frac{\sum_im_i\vec{x_i}}{M}\right)=\frac{d}{dt}\vec{X}_\text{cm}\end{aligned}$$

외력이 없을 때, 전체시스템을 한개의 점(center of mass; 질량중심)으로 대체할 수 있다.

$$\vec{X}_\text{cm}=\frac{\sum_im_i\vec{x_i}}{M}$$

하지만 밀도(단위부피당 질량)는 위치마다 모두 다를 것이다. Center of mass를 밀도 $\rho$로 표현하면:

$$dm=\rho(\vec{X})\cdot dV$$

- $dm$: 단위질량
- $\rho$: 밀도 (위치 $\vec{X}$에 대한 함수)
- $dV$: 단위부피

$$\vec{X}_\text{cm}=\frac{\int\vec{X}\cdot\rho(\vec{X})dV}{\int\rho(\vec{X})dV}$$

### Rocket

자기 자신의 질량 일부를 뒤로 분사하며 앞으로 나아가는 물체.

중요한 요소들:

- $\frac{dm}{dt}$: 매초 사라지는 질량 $(\frac{dm}{dt}<0)$
- $v_c$: 연료의 분사속도 $(v_c>0)$

Momentum 보존법칙을 얘기할 때는 어느 하나의 관성계를 설정해야 한다. 로켓은 가속하고 있기 때문에 로켓 내부에서는 Newton 법칙이 성립하지 않는다. 로켓 외부에서 보면 momentum 보존법칙이 성립한다.

- 연료 분사 전 운동량: $m(t)\cdot v(t)$
- 연료 분사 후
	- 로켓의 질량: $m+\Delta m$
	- 로켓의 속도: $v+\Delta v$
	- 연소한 연료의 질량: $-\Delta m$
	- 연소한 연료의 속도: $-v_c+v$

$$\begin{aligned}v(t)m(t)&=(m+\Delta m)(v+\Delta v)+(-\Delta m)(-v_c+v)\\&\Downarrow\\\cancel{mv}&=\cancel{mv}+\cancel{\Delta mv}+m\Delta v+\Delta m\Delta v+\Delta mv_c-\cancel{v\Delta m}\\0&=m\Delta v+\Delta m\Delta v+\Delta mv_c\\&\Downarrow (\Delta m\Delta v \text{ is too small.})\\0&=m\Delta v+\cancel{\Delta m\Delta v}+\Delta mv_c\\0&=m\Delta v+\Delta mv_c\\&\Downarrow\\m\frac{dv}{dt}&=-v_c\frac{dm}{dt}>0\end{aligned}$$

로켓의 질량 $m$은 감소하고 있지만, 로켓의 속도는 증가하고 있다. 그리고, 좌변은 $ma$이고, 우변은 $-v_c\frac{dm}{dt}$를 추진력이라고 말할 수 있다.

$$\begin{aligned}m\frac{dv}{dt}&=-v_c\frac{dm}{dt}\\&\Downarrow\\\frac{dv}{dt}&=-v_c\frac{1}{m}\frac{dm}{dt}=-v_c\frac{d}{dt}\ln{m}&&(\because \frac{d}{dt}\ln{m}=\frac{1}{m}\frac{dm}{dt})\\&\Downarrow\\v(t)-v_0&=-v_c\left(\ln{m(t)}-\ln{m_0}\right)\\&=-v_c\ln{\frac{m(t)}{m_0}}\end{aligned}$$

로켓을 가속할 때, 연료의 질량에 대해서 logarithmic하기 때문에 연료를 얼마나 많이 싣느냐는 중요하지 않다. 분사속도 $v_c$가 훨씬 중요하다. 

---

## CHAPTER 9. 원운동

### 등속원운동

- $\frac{d\theta}{dt}=\omega$ (일정)
- 반지름 $\|\vec{r}\|=R$

1. $\vec{r}\perp\vec{v}$

	$$\begin{aligned}\vec{r}&=(R\cos{\theta}, R\sin{\theta})\\\vec{v}=\frac{d\vec{r}}{dt}&=R(-\sin{\theta}\frac{d\theta}{dt},\cos{\theta}\frac{d\theta}{dt})\\&=R\omega(-\sin{\theta},\cos{\theta})\\&\Downarrow\\\vec{r}\cdot\vec{v}&=R^2\omega(-\sin{\theta}\cos{\theta}+\sin{\theta}\cos{\theta})\\&=0\end{aligned}$$

1. $\vec{a}\propto-\vec{r}$

	$$\begin{aligned}\vec{a}=\frac{d\vec{v}}{dt}&=R\omega^2(-\cos{\theta}, -\sin{\theta})\\&=-\omega^2\vec{r}\\|\vec{a}|&=\omega^2R\\|\vec{v}|&=\omega R\\&\Downarrow\\a&=\frac{v^2}{R}\end{aligned}$$

> ##### 원자폭탄 제조
>
> $$E=mc^2$$
>
> - $\text{U}^{235}$: 불안정 $(1\%)$ 존재
> - $\text{U}^{238}$: 안정
>
> 이 둘을 원심분리기의 원심력(관성; 가짜힘) 이용해 분리해야 한다 (대략 분당 $10^5$회):
>
> $$F=m\cdot a=m\cdot\frac{v^2}{R}$$
>
> 더 무거운 $\text{U}^{238}$이 더 큰 원심력을 받는다. 원자폭탄 제조기술력은 원심분리기 제작 기술력에 있다.

등속원운동에는 주기가 있다:

$$\begin{aligned}T&=\frac{2\pi R}{v}=\frac{2\pi}{\omega}=\frac{1}{\nu}\\&\Downarrow\\\omega&=2\pi\nu\\v&=R\cdot\omega=R\cdot\frac{2\pi}{T}\end{aligned}$$

> ##### 롤러코스터
>
> $$\frac{v^2}{r} \geq g$$
>
> - 구심가속도 $\frac{v^2}{r}$
> - 중력가속도 $g$

---

## CHAPTER 10. 회전운동

### 강체의 회전

> ##### 강체
>
> 물체를 구성하는 임의의 두 particle 사이의 거리 $r_{ij}$가 일정한 물체

$$\begin{aligned}E_k&=\frac{1}{2}mv^2\\&=\frac{1}{2}\sum_im_i\left(r_{i\perp}\omega\right)^2\\&=\frac{1}{2}\underbrace{\sum_i\left(m_ir_{i\perp}^2\right)}_{I}\omega^2\\&=\frac{1}{2}I\omega^2\end{aligned}$$

- $E_k$: 운동에너지
- $\vec{r}_i$: 원점에 대한 어느 입자 $i$의 위치
- $\vec{r}_\perp$: 강체의 회전축에 대해 수직인 방향
- $v$: 회전속도 $(=\vec{r}_\perp\cdot\omega)$
	- 강체를 구성하는 모든 입자는 동일한 각속도 $\omega$의 원운동을 한다.
- $I$: 관성모멘트(회전관성)
	$$I=\sum_im_ir_{i\perp}^2$$

### 각운동량 $L$

$$\begin{aligned}\vec{p}&=m\vec{v}\\&\Downarrow\\\vec{L}=\vec{r}\cdot\vec{p}&=\vec{r}\cdot m\vec{v}=\vec{r}m\cdot\vec{r}\omega=m\vec{r}^2\omega\end{aligned}$$

회전하는 강체의 각운동량은 강체를 구성하는 모든 입자에 대해서 운동량을 다 더해주면 된다:

$$L_\text{total}=\sum_iL_i=\sum_im_i\vec{r}_{i\perp}^2\omega=I\omega$$

### 관성모멘트 $I$의 계산

어떤 **1차원 고리**(질량: $M$, 반지름: $R$)가 있다고 가정하자:

$$M=2\pi R\cdot\lambda$$

- $\lambda$: 단위길이당 질량
	$$\lambda=\frac{dm}{dl}$$

관성모멘트 $I$는

$$\begin{aligned}I=\sum_im_ir_i^2\rightarrow\int dm\cdot r^2&=R^2\int dm &&(\because \vec{r}^2=R^2)\\&=MR^2\end{aligned}$$

**2차원 원판**의 경우, 여러 개로 나뉘어진 고리를 적분한다. 임의의 어느 한 고리의 질량은 다음과 같다:

$$2\pi r\cdot dr\cdot\sigma$$

- $dr$: 고리의 두께
- $\sigma$: 단위면적당 질량

> ##### 원판 전체의 질량 $M$
>
> $$M=\pi R^2\cdot\sigma$$

고리 하나에 대한 관성모멘트 $dI$는

$$\begin{aligned}dI&=(2\pi r\cdot dr\cdot\sigma)r^2\\&\Downarrow\\I&=\sigma\int_0^R2\pi r^3dr=\frac{\pi}{2}R^4\sigma=\frac{1}{2}MR^2&&(\because M=\pi R^2\sigma)\end{aligned}$$

**3차원 구**의 경우, 여러 개로 나뉘어진 원판을 적분하면 된다.

> ##### 구 전체의 질량 $M$
>
> $$M=\frac{4\pi}{3}R^3\cdot\rho$$

원판 하나의 질량은 다음과 같고:

$$dm=\rho\cdot dz\cdot\pi(R^2-z^2)$$

- $\rho$: 단위부피당 질량
- $z$: 구의 중심부터 원판까지의 거리

원판 하나에 대한 관성모멘트 $dI$는

$$\begin{aligned}dI&=dm\cdot\frac{1}{2}(R^2-z^2)\\&\Downarrow\\I&=2\int_0^R\frac{1}{2}(R^2-z^2)\cdot\rho\cdot dz\cdot\pi(R^2-z^2)\\&=\int_0^R\rho\cdot\pi\cdot(R^2-z^2)^2dz\\&=\rho\cdot\pi\int_0^R(R^4-2R^2z^2+z^4)dz\\&=\rho\cdot\pi R^5\left(1-\frac{2}{3}+\frac{1}{5}\right)\\&=\frac{8}{15}\pi\cdot\rho R^5\\&=\frac{2}{5}MR^2\end{aligned}$$

관성모멘트 $I=\sum_im_ir_{i\perp}^2$이기 때문에 $MR^2$의 상수배 형태로 나타난다.

### 평행축 정리 (Parallel Axis Theorem)

Center of mass를 지나는 축과 임의의 점을 지나는 다른 축이 $d$만큼 떨어져 있을 때 다음이 성립한다.

$$I=I_\text{cm}+Md^2$$

- $I_\text{cm}$: Center of mass를 지나는 축으로 회전시켰을 때의 관성모멘트
- $I$: Center of mass를 지나는 축과 평행하면서 $d$만큼 떨어진 위치에 존재하는 축으로 회전시켰을 때의 관성모멘트
- $M$: 강체의 전체 질량

> ##### 증명
>
> Center of mass을 **좌표계의 원점**으로 설정할 경우 당연하게도 $\vec{X}_\text{cm}=0$ 이다.
>
> $$\begin{aligned}\vec{X}_\text{cm}&=\frac{\sum_im_i\vec{x}_i}{M}=0\\&\Downarrow\\\sum_im_i\vec{x}_i&=0\end{aligned}$$
>
> Center of mass에서 $d$만큼 떨어진 어떤 회전축에 내린 수선의 발을 $O$라고 하고, $O$를 좌표계의 원점으로 설정한다면:
>
> - ($O$ 기준) 임의의 점 $X_i$의 위치 벡터: $\overrightarrow{OX_i}=\vec{r}_i$
> - ($O$ 기준) center of mass의 위치 벡터: $\vec{X}_\text{cm}$
> - $\vec{X}_\text{cm}$에서 점 $X_i$까지의 벡터: $\vec{r^\prime}_i$
>
> $$\begin{aligned}\vec{r}_i&=\vec{r'}+\vec{X}_\text{cm}\\&\Downarrow\text{ with regard to orthogonal part}\\\vec{r}_{i\perp}&=\vec{r'}_{i\perp}+\vec{X}_{\text{cm}\perp}\end{aligned}$$
>
> $$\begin{aligned}I&=\sum_im_i\left(\vec{r}_{i\perp}\right)^2\\&=\sum_im_i\left\{\left(\vec{r'}_{i\perp}\right)^2+\left(\vec{X}_{\text{cm}\perp}\right)^2+2\vec{r'}_{i\perp}\cdot\vec{X}_{\text{cm}\perp}\right\}\\&=\underbrace{\sum_im_i\left(\vec{r'}_{i\perp}\right)^2}_{I_\text{cm}}+\underbrace{\sum_im_i}_{M}\underbrace{\left(\vec{X}_{\text{cm}\perp}\right)^2}_{d^2}+2\sum_im_i\cdot\vec{r'}_{i\perp}\cdot\vec{X}_{\text{cm}\perp}\\&=I_\text{cm}+Md^2+2\vec{X}_{\text{cm}\perp}\cdot\sum_im_i\vec{r'}_{i\perp}\\&=I_\text{cm}+Md^2+2\vec{X}_{\text{cm}\perp}\cdot\cancel{\frac{\sum_im_i\vec{r'}_{i\perp}}{M}}\cdot M\\&=I_\text{cm}+Md^2\end{aligned}$$

### 미끄러짐 없이 빗면을 굴러 내려가는 원판

앞서 설명한 내용은 결국 이 문제를 해결하기 위함이었다.

$$I_\text{cm}=c\cdot MR^2$$

- $I_\text{cm}$: Center of mass의 관성모멘트
- $c$: 관성모멘트 계수 (원판: $\frac{1}{2}$, 구: $\frac{2}{5}$)
- $M$: 원판의 질량
- $R$: 원판의 반지름

원판이 굴러 내려가는 어느 한 순간, 원판의 모든 입자는 빗면과 닿아 있는 점을 중심으로 **회전운동** 한다고 볼 수 있다.

원판을 하나의 점(center of mass)으로 생각했을 때, center of mass는 $R$만큼 떨어진 거리에서 1차원 고리의 회전운동으로 볼 수 있고, 원판을 구성하는 입자들이 center of mass를 중심으로 도는 것은 2차원 원판의 회전운동으로 볼 수 있다. 따라서 총 관성모멘트는 다음과 같다:

$$I=MR^2+cMR^2=(1+c)MR^2$$

따라서 운동에너지 $E_k$는 다음과 같이 쓸 수 있다:

$$\begin{aligned}E_k=\frac{1}{2}I\omega^2&=\frac{1}{2}\cdot(1+c)M\underbrace{R^2\cdot\omega^2}_{V_\text{cm}^2}\\&=\frac{1}{2}MV_\text{cm}^2+\frac{1}{2}\underbrace{cMR^2}_{I_\text{cm}}\omega^2\\&=\frac{1}{2}MV_\text{cm}^2+\frac{1}{2}I_\text{cm}\omega^2\end{aligned}$$

즉, center of mass의 (병진)운동에너지와 center of mass의 회전운동에너지의 합으로 표현된다. 원판을 구성하는 각 입자들의 운동을 고려할 필요 없이 center of mass의 운동만 생각하면 되기 때문에 문제가 간편해진다.

원판과 빗면의 접촉점의 궤적을 그리면 [cycloid](https://en.wikipedia.org/wiki/Cycloid) 곡선을 그린다. 접촉면에서의 힘의 방향과 마찰력의 방향은 수직이라 마찰력은 $0$이다.

---

## CHAPTER 11. 굴림운동

$$L = I\omega$$

- $L$: Angular momentum (각운동량)

	$$\begin{aligned}F&=\frac{dp}{dt}\\rF&=r\frac{dp}{dt}=\frac{d(rp)}{dt}\end{aligned}$$

	- $F$: 원심력의 방향과 **수직** 방향의 힘
	- $r$: 원운동의 반지름
	- $(rp)$: 돌려고 하는 운동 관성

### 회전운동에 대한 Newton 제 2법칙

$$rF=\tau=\frac{dL}{dt}$$

- $\tau$: 돌림힘(토크)

### 두 힘의 외적

두 힘 $\vec{A}$와 $\vec{B}$의 외적은 3차원에서만 정의된다:

$$\vec{A}\times\vec{B}$$

- 벡터 물리량
- 방향: $\vec{A}$와 $\vec{B}$에 수직
- 크기: $\vec{A}$와 $\vec{B}$이 이루는 평행사변형의 면적
	- $\|\vec{A}\times\vec{B}\|=\|\vec{A}\|\|\vec{B}\|\cos{\theta}$
	- $\vec{A}$와 $\vec{B}$가 평행하면 $\vec{A}\times\vec{B}=0$
- $\vec{B}\times\vec{A}$는 크기는 같고 방향은 반대:

$$\begin{aligned}\vec{A}\times\vec{B}&=-\vec{B}\times\vec{A}\\&\Downarrow\\(\vec{A}+\vec{B})\times(\vec{A}+\vec{B})&=0\end{aligned}$$

$$\begin{aligned}\vec{F}&=\frac{d\vec{p}}{dt}\\&\Downarrow\\\vec{r}\times\vec{F}&=\vec{r}\times\frac{d\vec{p}}{dt}\end{aligned}$$

우변은 라이프니츠 룰에 의해 다음과 같이 서술 가능:

$$\begin{aligned}\frac{d}{dt}(\vec{r}\times\vec{p})&=\vec{v}\times\vec{p}+\vec{r}\times\frac{d\vec{p}}{dt}\\&=\cancel{\vec{v}\times(m\vec{v})}+\underbrace{\vec{r}\times\frac{d\vec{p}}{dt}}_{\vec{r}\times\vec{F}}\\&=\vec{r}\times\vec{F}\\&=\vec{\tau}\\&\Downarrow\\\vec{\tau}&=\frac{d}{dt}(\vec{r}\times\vec{p})\end{aligned}$$

Angular momentum $L$의 벡터적인 정의:

$$\vec{L}=\vec{r}\times\vec{p}$$

그러므로 다음과 같이 정리할 수 있다:

$$\vec{\tau}=\frac{d\vec{L}}{dt}$$

### (REVIEW) 미끄러짐 없이 빗면을 굴러 내려가는 원판

원판이 빗면을 **구르지 않고** 내려간 후 속도

$$\begin{aligned}E_k=\frac{1}{2}MV^2&=Mgh\\&\Downarrow\\V^2&=2gh\end{aligned}$$

보다 원판이 **회전하면서** 빗면을 굴러 내려간 후의 경우

$$\begin{aligned}E_k=\frac{1}{2}MV_\text{cm}^2+\frac{1}{2}\underbrace{cMR^2}_{I_\text{cm}}\omega^2&=Mgh\\&\Downarrow \left(V=R\omega, c=\frac{1}{2}\right)\\\frac{3}{4}\cancel{M}V^2&=\cancel{M}gh\\&\Downarrow\\V^2&=\frac{gh}{\frac{3}{4}}=\frac{2}{3}(2gh)\end{aligned}$$

속도가 더 느리다. 왜냐하면 원판이 회전하는데에도 에너지가 소모되기 때문이다.

원판이 빗면을 다 내려간 후 속도는 다음과 같이 일반화하여 다시 쓸 수 있다:

$$V^2=\frac{gh}{\frac{1}{2}(1+c)}=\frac{2gh}{1+c}$$

이 문제를 $\tau$로 다시 풀어보자.

원판(질량: $M$)이 빗면(기울기: $\theta$)을 굴러 내려가기 전 center of mass를 원점으로 하고, 원판이 빗면을 굴러 내려가면서 병진운동하는 궤적을 축으로 좌표계를 설정하면, 다음과 같은 힘이 균형을 이룬다:

- $y$축 방향으로 작용하는 힘 $Mg\cos{\theta}$
	- 반대 방향으로 수직항력 $N$
- $x$축 방향으로 작용하는 힘 $Mg\sin{\theta}$
	- 이 힘으로 인해 병진운동방향으로 가속도 $a$가 발생
	- 반대 방향으로 마찰력 $f(=N\mu)$
	
이 때, 힘의 균형을 나타내면:

$$\begin{aligned}Ma&=Mg\sin{\theta}-f\\N&=Mg\cos{\theta}\end{aligned}$$

이다. 여기서 원판의 회전운동에 대해서 더 생각해볼 수 있는데, 각 힘이 작용하는 작용점에 대한 토크를 살펴보면 다음과 같다:

- $\tau_{N}\rightarrow 0$ $(\because \vec{r} \parallel N)$
- $\tau_{Mg\sin{\theta}}\rightarrow 0$ $(\because R=\|\vec{r}\|=0)$
- $\tau_f\rightarrow \vec{r}\times\vec{f}$ $(\because \vec{r}\perp \vec{f} )$

> ##### 각가속도 $\alpha$와 직선운동 가속도 $a$와의 관계
>
> $$\vec{r}\times\vec{F}=\frac{d\vec{L}}{dt}=\frac{d}{dt}I\omega=I\alpha$$
>
> - 각속도 $\omega=\frac{d\theta}{dt}$
> - 각가속도 $\alpha=\frac{d\omega}{dt}=\frac{d^2\theta}{dt^2}$
> 
> $$\begin{aligned}R\frac{d^2\theta}{dt^2}=R\alpha=\frac{d^2}{dt^2}(R\theta)=\frac{d^2}{dt^2}l=a\end{aligned}$$
>
> $$\therefore a=R\alpha$$

$$\begin{aligned}\tau&=I\cdot\frac{d\omega}{dt}=I\alpha=fR\\f&=\frac{I}{R}\alpha=\frac{I}{R}\cdot\frac{a}{R}\\&\Downarrow\\Ma&=Mg\sin{\theta}-\frac{I}{R^2}a\\I&=cMR^2\\&\Downarrow\\\therefore a&=\frac{Mg\sin{\theta}}{M+\frac{I}{R^2}}=\frac{g\sin{\theta}}{1+c}\end{aligned}$$

만약 $c=0$으로 원판이 회전운동을 하지 않고 빗면을 병진운동으로 내려오는 상황이라면, 그 때의 가속도는 우리가 잘 알듯이 $a=g\sin{\theta}$ 이다.

그리고 시간에 따른 원판의 물리량은 다음과 같이 구할 수 있다.

$$\begin{aligned}v(t)&=at\\s(t)&=\frac{1}{2}at^2\end{aligned}$$

- $v(t)$: $t$초 후 속도
- $s(t)$: $t$초 후 이동 거리

원판이 빗면을 모두 내려와서의 속도는 앞서 다음과 같이 구했다.

$$v^2=\frac{2gh}{1+c}$$

이 때 빗면의 높이 $h$를 원판이 최종적으로 이동한 거리로 다시 나타내면

$$h=s\sin{\theta}$$

이고, 이를 대입하면

$$v^2=\frac{2gh}{1+c}=2\cdot\underbrace{\frac{g\sin{\theta}}{1+c}}_{a}\cdot s=2as$$

이는 다음의 결과와 동일하다:

$$\begin{aligned}v&=at\\s&=\frac{1}{2}at^2=\frac{1}{2}\cdot\frac{(at)^2}{a}=\frac{1}{2}\cdot\frac{v^2}{a}\\&\Downarrow\\v^2&=2as\end{aligned}$$

---

## Other Lectures

1. [물리현상의 원리](https://www.youtube.com/watch?v=jZ61Nnq_zAw&list=PLGF0JqQbSvJpesmPJfHSmvfcjV5FTFzyb)
	- "물리학의 효용성, 물리학과 세계관" 등 13개 강의
1. [일반물리학1](https://www.youtube.com/watch?v=x6fCDF9Lfgk&list=PL64B5F3F1CE0810A7)
	- "물리학의 정의와 효용, 힘의 속성들" 등 25개 강의
1. [일반물리학2](https://www.youtube.com/watch?v=oWbSNwVZLSI&list=PL4D242F3BA8DD1153)
	- "전하와 전장" 등 24개 강의
1. [수리물리학1](https://www.youtube.com/watch?v=o71vIah8BuA&list=PLyKE9Ujr4dw4mFJAPiJIIpMag_l31U1ek)
	- "Vector Analysis 1" 등 70개 강의
1. [수리물리학2](https://www.youtube.com/watch?v=Qz1uGc5Rvrs&list=PLSN_PltQeOyhynRBr2oYjq7Ts4c2C3LMH)
	- "무한급수와 타원적분" 등 24개 강의
1. [고급 수리물리학](https://www.youtube.com/watch?v=iDoH2EVS76g&list=PLFD724D6F9BC133E6)
	- "에르밑 함수(1부)" 등 22개 강의
1. [양자역학1](https://www.youtube.com/watch?v=bl4ZFwHOWXo&list=PLGF0JqQbSvJq-rfpEvsoeQ45xpYBL0ii7)
	- "물질의 이중성과 확률해석" 등 24개 강의
1. [양자역학2](https://www.youtube.com/watch?v=c8W9QySDSGA&list=PLGF0JqQbSvJoXuZuWj8Dkg68DgiBGm_sa)
	- "Pertubation theory" 등 25개 강의
1. [고급양자역학](https://www.youtube.com/watch?v=Fj5z4PWpnTU&list=PLGF0JqQbSvJoTqpWFxdOF_BfWJJZm3uON)
	- "Why Quantum Field Theory" 등 27개 강의

---

## References

1. [Quantum Mechanics (2013) - 신상진](http://hepth.hanyang.ac.kr/~sjs/qm/qm.html)
