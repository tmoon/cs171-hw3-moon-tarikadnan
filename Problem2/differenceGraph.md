CS 171 Design Studio 2 - Github Commit Graph
<h3> PART 1 - ANALYSIS</h3>
1. Trend: The number of people increased exponentially after the 1800s.

2. Estimates prior to 1300 are very erratic and they disagree amongst sources. But after that the estimates are more consistent.

3. For earlier time periods, the absolute difference may be small like a few hundred thousands will have a big relative difference since the population is small to begin with. However, for later time periods, the relative difference is small relative to the entire world population so the uncertainties are lower.
    
4. It is possible to use something like confidence intervals to show the band inside which all of our data will be. The width of the confidence interval represents the degree of uncertainty. 

5. The points are more or less in an exponential curve so a linear interpolation, which clearly is not the best model fit of the data, would increase our uncertainty.

6. It seems that using a log scale might better provided the data is distributed exponentially. 

<h3>PART 2 - SKETCHING</h3>
In the visualization part, we considered several options to show the disparity between different records. We agreed that the mean would be the best metric to figure out the mid-value for any point. Then we considered three sketches-- scatter plot, confidence band, error bars. Finally we sticket with confidence band, because it depicts the uncertainty the best.


<h3>Group Reflection</h3>
We agreed that all these methods might be pretty good for the visualization. However, most of us preferred the confidence-bar alike model.

<h3> Implementation</h3>
When we tried to implement it, in the given linear scale the confidence band was not clear at all. So we decided to multiply the deviation from the mean by some constant to show the difference clearly (and the scale it still linear). We found that the earlier population values had a lot of uncertainlty (clear from the percentage graph) and the fututre predictions are a bit uncertain; however, still the percentage uncertainty is way less than the very early ages. </br>

Attched: lab3.jpeg